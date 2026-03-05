import {useEffect} from "react";
import Sidebar from "@/components/Sidebar";
import ContactForm from "@/components/Connect/ContactForm";
import FAQSection from "@/components/Faqs";

function contact() {

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // window.scrollTo(0, 0); //hard scroll
    }, []);

    const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      "Please send a mail to abhisheksharma7340733@gmail.com with your details and we'll change your password as requested. Or try filling contact form with your concern.",
  },
  {
    question: "Do you offer custom pricing plans?",
    answer:
      "Yes, we tailor our pricing based on the specific needs and scale of your project. Contact us for a personalized quote.",
  },
  {
    question: "How do I get started with a new project?",
    answer:
      "Simply fill out our contact form or send us an email. We'll schedule a discovery call to discuss your goals within 24 hours.",
  },
  {
    question: "Can I upgrade my plan later on?",
    answer:
      "Absolutely! You can change your subscription tier at any time through your account dashboard or by contacting support.",
  },
];

  return (
    <>
      <div className="min-h-screen bg-neutral-50 dark:bg-black">
        <Sidebar />
        <main className="min-h-screen pt-20 pb-20 px-4">
          <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
            <h1 className="font-semibold">Contact</h1>
            <ContactForm />
            <FAQSection faqs={faqs}/>
          </div>
        </main>
      </div>
    </>
  );
}

export default contact;
