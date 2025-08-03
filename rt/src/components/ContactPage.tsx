import React from 'react';

const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you!</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Remember to offer beautiful flowers from FlowerShop for Valentine's Day, Mother's Day, Christmas...<br />
              Send us a message and we'll get back to you within 24 hours.
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Ways to Reach Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Address</p>
                <p className="text-gray-600">Somewhere on Earth</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Phone</p>
                <p className="text-gray-600">+0123456789</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Email</p>
                <p className="text-gray-600">FlowerShop.Shop@gmail.com</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Business Hours</p>
                <p className="text-gray-600">8 AM - 11 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
