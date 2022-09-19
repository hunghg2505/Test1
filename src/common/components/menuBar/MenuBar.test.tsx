import { render, screen, waitFor } from "test-utils";
import MenuBar from "./index";
import { useLocation } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("Menubar Unit Tests", () => {
  const beforeEachTest = () => {
    render(<MenuBar />);
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("render", () => {
    it("should render Search Wallet User menu", () => {
      beforeEachTest();
      const menu = screen.getByText("Search Wallet User");
      expect(menu).toBeInTheDocument();
    });

    it("should render Search Activity Logs menu", () => {
      beforeEachTest();
      const menu = screen.getByText("Search Activity Logs");
      expect(menu).toBeInTheDocument();
    });
  });

  describe("active menu", () => {
    it("Search Wallet User menu should active when path is /", () => {
      (useLocation as jest.Mock).mockImplementationOnce(() => ({
        pathname: "/",
      }));
      beforeEachTest();
      const walletMenu = screen.getByRole("button", { name: "Search Wallet User" });
      const activityMenu = screen.getByRole("button", { name: "Search Activity Logs" });
      expect(walletMenu).toHaveStyle("background-color : rgb(0, 114, 212)");
      expect(activityMenu).toHaveStyle("background-color : transparent");
    });

    it("Search Wallet User menu should active when path is not include exist path", () => {
      (useLocation as jest.Mock).mockImplementationOnce(() => ({
        pathname: "/notfoundthispath",
      }));
      beforeEachTest();
      const walletMenu = screen.getByRole("button", { name: "Search Wallet User" });
      const activityMenu = screen.getByRole("button", { name: "Search Activity Logs" });
      expect(walletMenu).toHaveStyle("background-color : rgb(0, 114, 212)");
      expect(activityMenu).toHaveStyle("background-color : transparent");
    });

    it("Search Activity Logs should active when path is /activity-log", async () => {
      (useLocation as jest.Mock).mockImplementationOnce(() => ({
        pathname: "/activity-log",
      }));
      beforeEachTest();
      const walletMenu = screen.getByRole("button", { name: "Search Wallet User" });
      const activityMenu = screen.getByRole("button", { name: "Search Activity Logs" });
      await waitFor(() => expect(walletMenu).toHaveStyle("background-color : transparent"));
      await waitFor(() => expect(activityMenu).toHaveStyle("background-color : rgb(0, 114, 212)"));
    });

    it("Search Activity Logs should active when path is /activity-log/*", async () => {
      (useLocation as jest.Mock).mockImplementationOnce(() => ({
        pathname: "/activity-log/12345",
      }));
      beforeEachTest();
      const walletMenu = screen.getByRole("button", { name: "Search Wallet User" });
      const activityMenu = screen.getByRole("button", { name: "Search Activity Logs" });
      await waitFor(() => expect(walletMenu).toHaveStyle("background-color : transparent"));
      await waitFor(() => expect(activityMenu).toHaveStyle("background-color : rgb(0, 114, 212)"));
    });
  });
});
