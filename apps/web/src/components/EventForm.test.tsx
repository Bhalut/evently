import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventForm from "./EventForm";
import { api } from "../lib/api";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("../lib/api", () => ({
  api: {
    post: jest.fn(),
    put: jest.fn(),
  },
}));

describe("EventForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<EventForm />);
    expect(screen.getByText("Create New Event")).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument();
  });

  it("validates input", async () => {
    render(<EventForm />);
    const submitBtn = screen.getByRole("button", { name: /Save Event/i });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 3 characters")
      ).toBeInTheDocument();
    });
  });

  it("submits form with correct data", async () => {
    const user = userEvent.setup();
    render(<EventForm />);

    await user.type(screen.getByLabelText(/Event Name/i), "Test Event");
    // For datetime-local, value format is YYYY-MM-DDTHH:mm
    const dateInput = screen.getByLabelText(/Date & Time/i);
    fireEvent.change(dateInput, { target: { value: "2024-01-01T12:00" } });

    await user.type(
      screen.getByLabelText(/Description/i),
      "A description longer than 10 chars"
    );
    await user.type(screen.getByLabelText(/Location/i), "Test Place");

    const submitBtn = screen.getByRole("button", { name: /Save Event/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/events",
        expect.objectContaining({
          name: "Test Event",
          description: "A description longer than 10 chars",
          place: "Test Place",
        })
      );
    });
  });
});
