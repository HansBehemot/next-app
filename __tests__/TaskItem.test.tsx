import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "@/components/TaskItem";

const task = { id: 1, text: "Nauczyć się testów", done: false };

describe("TaskItem", () => {
  it("wyświetla tekst zadania", () => {
    render(<TaskItem task={task} onToggle={() => {}} onDelete={() => {}} />);
    expect(screen.getByText("Nauczyć się testów")).toBeInTheDocument();
  });

  it("checkbox jest odznaczony gdy done = false", () => {
    render(<TaskItem task={task} onToggle={() => {}} onDelete={() => {}} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("checkbox jest zaznaczony gdy done = true", () => {
    render(<TaskItem task={{ ...task, done: true }} onToggle={() => {}} onDelete={() => {}} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("wywołuje onToggle po kliknięciu checkboxa", async () => {
    const onToggle = jest.fn();
    render(<TaskItem task={task} onToggle={onToggle} onDelete={() => {}} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it("wywołuje onDelete po kliknięciu przycisku Usuń", async () => {
    const onDelete = jest.fn();
    render(<TaskItem task={task} onToggle={() => {}} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: "Usuń" }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("tekst ma przekreślenie gdy done = true", () => {
    render(<TaskItem task={{ ...task, done: true }} onToggle={() => {}} onDelete={() => {}} />);
    const span = screen.getByText("Nauczyć się testów");
    expect(span).toHaveClass("line-through");
  });
});
