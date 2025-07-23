import emailjs from '@emailjs/browser';

// Initialize EmailJS only once if not already initialized
if (!emailjs.__initialized) {
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  emailjs.__initialized = true;
}

export const sendOrderEmail = async (cart, address, total) => {
  if (!address?.email || !address?.name) {
    throw new Error("Customer email and name are required");
  }

  const orderNumber = `#ORD-${Date.now().toString().slice(-6)}`;
  const formattedItems = cart
    .map(item => `• ${item.name} (x${item.quantity}) - $${(item.offerPrice || item.price).toFixed(2)}`)
    .join('\n');

  const shippingDetails = `${address.name}
${address.street}
${address.city}, ${address.zip}
Email: ${address.email}`;

  const message = `
Hello ${address.name},

Thank you for your purchase! 🎉

🧾 Order Number: ${orderNumber}
📅 Order Date: ${new Date().toLocaleString()}

🛒 Items:
${formattedItems}

💳 Total Amount: $${total.toFixed(2)}

🚚 Shipping Details:
${shippingDetails}

We’ll notify you when your order is shipped. If you have any questions, feel free to reply to this email.

Best regards,  
ShopPlus Store Team
`;

  const templateParams = {
    title: `Order Confirmation ${orderNumber}`,
    name: address.name,
    to_name: address.name,
    to_email: address.email,
    customer_email: address.email,
    message: message.trim(),
    time: new Date().toLocaleString()
  };

  try {
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log("✅ Order confirmation email sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Failed to send order email:", error);
    throw error;
  }
};
