
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Landing page protection (JavaScript alternative to the PHP protection)
const validateAccess = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const lpkeyua = urlParams.get('lpkeyua');
  
  if (!lpkeyua) {
    console.error("Access denied: Missing access key");
    document.body.innerHTML = '';
    return false;
  }
  
  const [hash, hashTime] = lpkeyua.split('.');
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Check if the hash time is expired (comparing with current timestamp)
  if (parseInt(hashTime) < currentTime) {
    console.error("Access denied: Expired access key");
    document.body.innerHTML = '';
    return false;
  }
  
  // In a real implementation, we would validate the hash here
  // For now, we'll just accept any non-expired hash for demonstration purposes
  
  return true;
};

// For development purposes - comment out in production for actual protection
// if (!validateAccess()) {
//   throw new Error("Access validation failed");
// }

createRoot(document.getElementById("root")!).render(<App />);
