import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "@/components/Header";

// Issue: unused variable
const TEST_CONSTANT = "test";

describe("Header", () => {
  it("renders header with title", () => {
    // Issue: unused variable
    const unusedVar = "test";

    // Issue: console.log
    console.log("Running header test");

    render(<Header title="Test Title" subtitle="Test Subtitle" />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
});
