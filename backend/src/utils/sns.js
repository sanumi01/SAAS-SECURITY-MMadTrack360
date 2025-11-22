module.exports = {
  publish: async (topic, message) => {
    console.log(`[SNS] Topic: ${topic}, Message: ${message}`);
    return { success: true };
  },
  sendSms: async (to, message) => {
    console.log(`[SMS] To: ${to}, Message: ${message}`);
    return { success: true };
  }
};
