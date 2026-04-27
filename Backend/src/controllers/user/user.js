const User = require("../../models/user");
const Contact = require("../../models/contactFrom")
const Post = require("../../models/post");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const { SendConnectionMail } = require("../../utils/mailer");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET;

async function handleUserSignup(req, res) {
  try {
    const { name, username, email, password, avatar } = req.body || {};

    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, username, email, and password are required" });
    }

    const existingUser = await User.exists({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const existingUsername = await User.exists({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // 🔐 Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      avatar: avatar || "Avatar1",
    });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email })
      .select("_id name username email avatar password about")
      .lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let isMatch = false;

    // ✅ Check if password is already hashed
    if (user.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // ✅ Plain password case
      isMatch = password === user.password;

      // 🔥 Auto-upgrade to hashed password
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(user._id, {
          password: hashedPassword,
        });
      }
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        about: user.about,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleGoogleAuth(req, res) {
  try {
    const { credential, userInfo } = req.body;

    let email, name, picture;

    if (userInfo) {
      // Implicit flow: userInfo fetched from Google's userinfo endpoint
      ({ email, name, picture } = userInfo);
    } else if (credential) {
      // ID Token flow (legacy): verify with google-auth-library
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      ({ email, name, picture } = payload);
    } else {
      return res.status(400).json({ message: "Missing Google credentials" });
    }

    if (!email) {
      return res.status(400).json({ message: "Could not retrieve email from Google" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        username: email.split("@")[0] + Math.floor(Math.random() * 1000),
        email,
        password: null,
        avatar: picture,
        isVerified: true,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Google authentication failed" });
  }
}


async function handleUserData(req, res) {
  const userId = req.user.id;
  const userData = await User.findById(userId).select("-password").lean();

  if (!userData) {
    return res.status(404).json({ message: "No data found" });
  }

  return res.status(200).json({ userData });
}

async function handleCreateContact(req, res) {
  try {
    const { name, phoneNumber, email, message, type } = req.body;

    const newContact = await Contact.create({
      name,
      phoneNumber,
      email,
      message,
      type,
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

async function handleUpdateUserData(req, res) {
  try {
    const userId = req.user.id;
    const updateFields = req.body || {};

    const allowedFields = ["name", "username", "email", "avatar", "about", "location", "password"];
    const updates = {};

    for (const key of allowedFields) {
      if (updateFields[key] !== undefined) {
        updates[key] = updateFields[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    if (updates.email) {
      const existingEmail = await User.exists({ email: updates.email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already taken" });
      }
    }

    if (updates.username) {
      const existingUsername = await User.exists({ username: updates.username, _id: { $ne: userId } });
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    // Handle password change specifically for security
    if (updates.password) {
      if (!updateFields.oldPassword) {
        return res.status(400).json({ message: "oldPassword is required to change the password" });
      }

      // Fetch the user's current password
      const currentUser = await User.findById(userId).select("password").lean();
      if (!currentUser || currentUser.password !== updateFields.oldPassword) {
        return res.status(401).json({ message: "Incorrect old password" });
      }

      // Optional: Since there is a minlength of 6 on the schema, we can enforce it explicitly
      if (updates.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password").lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User data updated successfully",
      userData: updatedUser
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleGetProfileByUsername(req, res) {
  const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;
  try {
    const normalized = String(req.query.username || "").trim().toLowerCase();

    if (!USERNAME_REGEX.test(normalized)) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const user = await User.findOne(
      { username: normalized },
      "name username about avatar"
    ).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleSavePostToUserData(req, res) {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedPosts: postId } },
      { new: true }
    );

    res.status(200).json({
      message: "Post saved successfully",
      savedPosts: user.savedPosts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleUnsavePost(req, res) {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedPosts: postId } },
      { new: true }
    );

    res.status(200).json({
      message: "Post unsaved successfully",
      savedPosts: user.savedPosts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleGetSavedPosts(req, res) {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select("username savedPosts")
      .populate({
        path: "savedPosts",
        select: "content photos likes comments shares createdAt author",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "name username avatar"
        }
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      username: user.username,
      savedPosts: user.savedPosts
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

async function handleVerifyOTP(req, res) {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.otp !== Number(otp) || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  return res.json({ message: "Email verified successfully" });
}

async function handleSendConnectMail(req, res) {
  try {
    const connectionId = req.params.id;
    const fromUserId = req.user.id;

    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(connectionId);

    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await SendConnectionMail({
      toEmail: toUser.email,
      fromUser
    });

    res.status(200).json({ message: "Connection mail sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending mail", error });
  }
}

async function handleDeleteUser(req,res) {
  try {
    const username = String(req.params.username || "").trim().toLowerCase();
    const requesterId = req.user?.id;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (!requesterId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const targetUser = await User.findOne({ username }).select("_id username");
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() !== requesterId.toString()) {
      const requester = await User.findById(requesterId).select("isAdmin").lean();
      if (!requester?.isAdmin) {
        return res.status(403).json({ message: "You can only delete your own account" });
      }
    }

    // Delete comments made by this user on all posts.
    await Post.updateMany(
      { "comments.userId": targetUser._id },
      { $pull: { comments: { userId: targetUser._id } } }
    );

    // Capture authored post IDs so we can remove saved references from other users.
    const authoredPosts = await Post.find({ author: targetUser._id }).select("_id").lean();
    const authoredPostIds = authoredPosts.map((post) => post._id);

    // Delete all posts created by this user.
    await Post.deleteMany({ author: targetUser._id });

    if (authoredPostIds.length > 0) {
      await User.updateMany(
        { savedPosts: { $in: authoredPostIds } },
        { $pull: { savedPosts: { $in: authoredPostIds } } }
      );
    }

    // Remove user likes from remaining posts.
    await Post.updateMany(
      { likes: targetUser._id },
      { $pull: { likes: targetUser._id } }
    );

    await User.deleteOne({ _id: targetUser._id });

    return res.status(200).json({
      message: "User, posts, and comments deleted successfully",
      deletedUsername: targetUser.username,
      deletedPostsCount: authoredPostIds.length,
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


async function handleSearchForUser(req, res) {
  try {
    // Treating req.params.id as the search term based on your function signature
    const searchTerm = req.params.id;

    if (!searchTerm) {
      return res.status(400).json({ 
        success: false, 
        message: "Search term is required" 
      });
    }

    // Search for users where the 'username' OR 'name' matches the search term
    const users = await User.find({
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { name: { $regex: searchTerm, $options: 'i' } }
      ]
    })
    .select('avatar username name about') // CRITICAL: Never send passwords to the frontend
    .limit(20);          // Limit results so a broad search doesn't crash your server

    return res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error("Error searching for user:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}


module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleGoogleAuth,
  handleUserData,
  handleCreateContact,
  handleUpdateUserData,
  handleGetProfileByUsername,
  handleSavePostToUserData,
  handleUnsavePost,
  handleGetSavedPosts,
  handleSendConnectMail,
  handleDeleteUser,
  handleSearchForUser
};
