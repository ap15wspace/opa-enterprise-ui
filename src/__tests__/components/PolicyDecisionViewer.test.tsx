import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PolicyDecisionViewer } from "@/components/wizard/PolicyDecisionViewer";

describe("PolicyDecisionViewer", () => {
  it("renders nothing when decision is null", () => {
    const { container } = render(
      <PolicyDecisionViewer decision={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows loading spinner when loading", () => {
    render(<PolicyDecisionViewer decision={null} loading />);
    expect(screen.getByText(/Evaluating policy/i)).toBeInTheDocument();
  });

  it("shows error message when error is provided", () => {
    render(
      <PolicyDecisionViewer decision={null} error="Connection refused" />
    );
    expect(screen.getByText("Connection refused")).toBeInTheDocument();
  });

  it("shows Access Allowed for allow=true", () => {
    render(
      <PolicyDecisionViewer decision={{ result: { allow: true } }} />
    );
    expect(screen.getByText(/Access Allowed/i)).toBeInTheDocument();
  });

  it("shows Access Denied for allow=false", () => {
    render(
      <PolicyDecisionViewer decision={{ result: { allow: false } }} />
    );
    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
  });
});
