import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handler = jest.fn();
    render(<Button onClick={handler}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("applies primary variant classes by default", () => {
    render(<Button>Primary</Button>);
    expect(screen.getByText("Primary")).toHaveClass("bg-indigo-600");
  });

  it("applies danger variant classes", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByText("Delete")).toHaveClass("bg-red-600");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByText("Cancel")).toHaveClass("border-gray-300");
  });
});
