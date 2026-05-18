import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AppRegistrationForm } from "@/components/wizard/AppRegistrationForm";
import type { ApplicationFormData } from "@/types";

const empty: ApplicationFormData = {
  name: "",
  clientId: "",
  description: "",
  ownerTeam: "",
};

describe("AppRegistrationForm", () => {
  it("renders all fields", () => {
    render(<AppRegistrationForm data={empty} onChange={jest.fn()} />);
    expect(screen.getByLabelText(/Application Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Client ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Owner Team/i)).toBeInTheDocument();
  });

  it("calls onChange when name is updated", () => {
    const onChange = jest.fn();
    render(<AppRegistrationForm data={empty} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Application Name/i), {
      target: { value: "my-service" },
    });
    expect(onChange).toHaveBeenCalledWith({ ...empty, name: "my-service" });
  });

  it("calls onChange when clientId is updated", () => {
    const onChange = jest.fn();
    render(<AppRegistrationForm data={empty} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Client ID/i), {
      target: { value: "my-svc-prod" },
    });
    expect(onChange).toHaveBeenCalledWith({
      ...empty,
      clientId: "my-svc-prod",
    });
  });
});
