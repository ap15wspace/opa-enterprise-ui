import type { OpaPolicy, PolicyInput } from "@/types";

// axios is mocked before the module under test is imported.
// jest.mock is hoisted to the top of the file by babel-jest/ts-jest,
// so we retrieve the mock instances via the module after mocking.
jest.mock("axios", () => {
  const instance = {
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };
  return { create: () => instance };
});

// Import axios after mocking to access the mocked instance
import axios from "axios";
import {
  listPolicies,
  getPolicy,
  putPolicy,
  deletePolicy,
  queryDecision,
} from "@/lib/opaClient";

// Retrieve the mock instance created by axios.create()
const axiosInstance = (axios.create as jest.Mock)() as {
  get: jest.Mock;
  put: jest.Mock;
  post: jest.Mock;
  delete: jest.Mock;
};

describe("opaClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listPolicies", () => {
    it("returns the result array from GET /v1/policies", async () => {
      const policies: OpaPolicy[] = [{ id: "app/main", raw: "package app.main\n" }];
      axiosInstance.get.mockResolvedValueOnce({ data: { result: policies } });
      const result = await listPolicies();
      expect(axiosInstance.get).toHaveBeenCalledWith("/v1/policies");
      expect(result).toEqual(policies);
    });
  });

  describe("getPolicy", () => {
    it("fetches a single policy by id", async () => {
      const policy: OpaPolicy = { id: "app/main", raw: "package app.main\n" };
      axiosInstance.get.mockResolvedValueOnce({ data: { result: policy } });
      const result = await getPolicy("app/main");
      expect(axiosInstance.get).toHaveBeenCalledWith("/v1/policies/app%2Fmain");
      expect(result).toEqual(policy);
    });
  });

  describe("putPolicy", () => {
    it("PUTs raw Rego with text/plain content-type", async () => {
      axiosInstance.put.mockResolvedValueOnce({});
      await putPolicy("app/main", "package app.main\n");
      expect(axiosInstance.put).toHaveBeenCalledWith(
        "/v1/policies/app%2Fmain",
        "package app.main\n",
        { headers: { "Content-Type": "text/plain" } }
      );
    });
  });

  describe("deletePolicy", () => {
    it("DELETEs the policy by id", async () => {
      axiosInstance.delete.mockResolvedValueOnce({});
      await deletePolicy("app/main");
      expect(axiosInstance.delete).toHaveBeenCalledWith("/v1/policies/app%2Fmain");
    });
  });

  describe("queryDecision", () => {
    it("POSTs input and returns decision", async () => {
      const decision = { result: { allow: true } };
      axiosInstance.post.mockResolvedValueOnce({ data: decision });
      const input: PolicyInput = {
        subject: { id: "u1", roles: ["admin"] },
        resource: "invoice",
        action: "read",
      };
      const result = await queryDecision("myapp/main", input);
      expect(axiosInstance.post).toHaveBeenCalledWith("/v1/data/myapp/main", { input });
      expect(result).toEqual(decision);
    });
  });
});
