import React from "react";

// Issue: unused variable
const ABOUT_CONSTANT = "about page";

function About() {
  // Issue: unused variable
  let pageTitle = "About Us";

  // Issue: console.log
  console.log("About page loaded");

  // Issue: var usage
  var contentClass = "about-content";

  // Issue: unused expression
  ("about page expression");

  return (
    <div className={contentClass}>
      <h1>About Us</h1>
      <p>This is a test page for the auto-fix workflow.</p>
    </div>
  );
}

export default About;
