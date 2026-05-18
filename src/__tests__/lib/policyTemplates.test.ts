import { getTemplate, POLICY_TEMPLATES } from "@/lib/policyTemplates";
import type { PolicyTemplateContext } from "@/types";

const ctx: PolicyTemplateContext = {
  appId: "my-app",
  resources: [
    { name: "invoice", description: "", actions: ["read", "write"] },
  ],
};

describe("policyTemplates", () => {
  it("exports three templates", () => {
    expect(POLICY_TEMPLATES).toHaveLength(3);
    expect(POLICY_TEMPLATES.map((t) => t.id)).toEqual([
      "role_based",
      "attribute_based",
      "custom",
    ]);
  });

  describe("role_based template", () => {
    it("generates Rego with package and allow rule", () => {
      const tpl = getTemplate("role_based")!;
      const rego = tpl.generate(ctx);
      expect(rego).toContain("package my_app.main");
      expect(rego).toContain("default allow := false");
      expect(rego).toContain('input.resource == "invoice"');
      expect(rego).toContain('input.subject.roles[_] == "admin"');
    });
  });

  describe("attribute_based template", () => {
    it("generates Rego with attribute condition", () => {
      const tpl = getTemplate("attribute_based")!;
      const rego = tpl.generate(ctx);
      expect(rego).toContain("package my_app.main");
      expect(rego).toContain("input.subject.attributes.department");
    });
  });

  describe("custom template", () => {
    it("generates a starter Rego skeleton", () => {
      const tpl = getTemplate("custom")!;
      const rego = tpl.generate(ctx);
      expect(rego).toContain("package my_app.main");
      expect(rego).toContain("default allow := false");
    });
  });

  it("returns undefined for unknown template id", () => {
    expect(getTemplate("unknown")).toBeUndefined();
  });
});
