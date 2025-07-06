import React from "react";

// Issue: unused variable
const unusedVariable = "this will be flagged";

// Issue: unused parameter
function Header({ title, subtitle }: { title: string; subtitle: string }) {
  // Issue: unused expression
  "unused expression";

  // Issue: console.log
  console.log("Header rendered");

  // Issue: var instead of const/let
  var headerClass = "header-main";

  // Issue: any type
  const handleClick = (event: any) => {
    console.log("Clicked:", event);
  };

  return (
    <header className={headerClass}>
      <h1>{title}</h1>
      <button onClick={handleClick}>Click me</button>
    </header>
  );
}

export default Header;
