import React, { useState } from "react";
import { Input } from "../../Input";
import { MultiSelect } from "../../MultiSelect";
import { Button } from "../../Button";
import { IProduct } from "../../../types/backend";
import { IPricingRule } from "../../../types/backend";

interface PricingRuleFormProps {
  rule?: IPricingRule;
  onSave: (data: IPricingRule) => void;
  products: IProduct[];
  onClose: () => void;
}

export const PricingRuleForm: React.FC<PricingRuleFormProps> = ({ rule, onSave, products, onClose }) => {
  const [formData, setFormData] = useState<IPricingRule>(
    rule || {
      id: 0,
      description: "",
      priceMultiplier: 1,
      priority: 1,
    }
  );

  const handleSubmit = () => {
    onSave({ ...formData, id: rule?.id || Date.now() });
    onClose();
  };

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">{rule ? "Edit" : "Add"} Pricing Rule</h3>
      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />
      <Input
        label="Condition"
        value={formData.condition || ""}
        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
      />
      <Input
        label="Special Day"
        value={formData.specialDay || ""}
        onChange={(e) => setFormData({ ...formData, specialDay: e.target.value })}
      />
      <Input
        label="Start Time"
        value={formData.startTime || ""}
        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
      />
      <Input
        label="End Time"
        value={formData.endTime || ""}
        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
      />
      <Input
        label="Start Date"
        value={formData.startDate || ""}
        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
      />
      <Input
        label="End Date"
        value={formData.endDate || ""}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
      />
      <Input
        label="Price Multiplier"
        type="number"
        value={formData.priceMultiplier}
        onChange={(e) => setFormData({ ...formData, priceMultiplier: Number(e.target.value) })}
        required
      />
      <Input
        label="Fixed Price"
        type="number"
        value={formData.fixedPrice || ""}
        onChange={(e) => setFormData({ ...formData, fixedPrice: Number(e.target.value) || undefined })}
      />
      <Input
        label="Priority"
        type="number"
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
        required
      />
      <MultiSelect
        label="Products"
        value={formData.productIds || []}
        onChange={(ids) => setFormData({ ...formData, productIds: ids })}
        options={products.map((p) => ({ value: p.id, label: p.name }))}
      />
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
};