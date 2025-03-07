interface RecaptchaResponse {
    success: boolean;
    challenge_ts?: string;
    hostname?: string;
    "error-codes"?: string[];
  }
  
  const verifyRecaptcha = async (token: string): Promise<RecaptchaResponse | null> => {
    try {
      const response = await fetch("http://localhost:8000/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data: RecaptchaResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error validando reCAPTCHA:", error);
      return null;
    }
  };
  
  export default verifyRecaptcha;
  