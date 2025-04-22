import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Load Remixicon CSS from CDN
const remixiconLink = document.createElement("link");
remixiconLink.href = "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css";
remixiconLink.rel = "stylesheet";
document.head.appendChild(remixiconLink);

// Add title and meta tags
const title = document.createElement("title");
title.textContent = "SocialSwap - Marketplace for Social Media Profiles";
document.head.appendChild(title);

const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Buy and sell social media profiles on SocialSwap - the #1 marketplace for established social media accounts";
document.head.appendChild(metaDescription);

createRoot(document.getElementById("root")!).render(<App />);
