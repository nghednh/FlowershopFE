import React, { useEffect, useState } from "react";
import { Input } from "../../Input";
import { TimePicker } from "../../TimePicker";
import { DatePicker } from "../../DatePicker"
import { MultiSelect } from "../../MultiSelect";
import { Button } from "../../Button";
import { IProduct } from "../../../types/backend";
import { IPricingRule } from "../../../types/backend";
import { createPricingRule, updatePricingRule, getProducts } from "../../../config/api";

interface PricingRuleFormProps {
  rule?: IPricingRule;
  onSave: (data: IPricingRule) => void;
  onClose: () => void;
}

export const PricingRuleForm: React.FC<PricingRuleFormProps> = ({ rule, onSave, onClose }) => {
  const [formData, setFormData] = useState<IPricingRule>(
    rule || {
      pricingRuleId: 0,
      description: "",
      priceMultiplier: 1,
      priority: 1,
    }
  );
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async (

  ) => {
    try {
      setLoading(true);
      setError(null);


      const productsData = await getProducts();
      setProducts(productsData.data.products);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const [validationError, setValidationError] = useState<string>("");

  // Combine date and time into a comparable Date object
  const createDateTime = (dateStr: string | null, timeStr: string | null): Date | null => {
    if (!dateStr) return null;

    const date = new Date(dateStr);
    if (timeStr) {
      // Handle both HH:MM and HH:MM:SS formats
      const timeParts = timeStr.split(':').map(Number);
      const hours = timeParts[0] || 0;
      const minutes = timeParts[1] || 0;
      const seconds = timeParts[2] || 0;
      date.setHours(hours, minutes, seconds, 0);
    }
    return date;
  };

  // Validate required fields and constraints
  const validateForm = (): boolean => {
    const { description, priceMultiplier, priority } = formData;

    // Description validation
    if (!description || description.trim() === "") {
      setValidationError("Description is required");
      return false;
    }

    // Price Multiplier validation
    if (!priceMultiplier || priceMultiplier < 0.01 || priceMultiplier > 100.0) {
      setValidationError("Price Multiplier must be between 0.01 and 100.0");
      return false;
    }

    // Priority validation
    if (!priority || priority < 1 || priority > 1000) {
      setValidationError("Priority must be between 1 and 1000");
      return false;
    }

    return true;
  };

  // Validate date and time combination
  const validateDateTime = (): boolean => {
    const { startDate, startTime, endDate, endTime } = formData;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today

    // If start date is provided, validate it's not before today
    if (startDate) {
      const startDateTime = createDateTime(startDate ?? null, startTime ?? null);

      if (startDateTime && startDateTime < today) {
        setValidationError("Start date cannot be in the past");
        return false;
      }
    }

    // If both start and end dates are provided, validate end is after start
    if (startDate && endDate) {
      const startDateTime = createDateTime(startDate ?? null, startTime ?? null);
      const endDateTime = createDateTime(endDate ?? null, endTime ?? null);

      if (startDateTime && endDateTime && endDateTime <= startDateTime) {
        setValidationError("End date and time must be after start date and time");
        return false;
      }
    }

    setValidationError("");
    return true;
  };

  // Combined validation function
  const validateAll = (): boolean => {
    return validateForm() && validateDateTime();
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = { ...formData, startDate: e.target.value };
    setFormData(newFormData);
    // Validate after state update
    setTimeout(() => validateDateTime(), 0);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = { ...formData, startTime: e.target.value };
    setFormData(newFormData);
    // Validate after state update
    setTimeout(() => validateDateTime(), 0);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = { ...formData, endDate: e.target.value };
    setFormData(newFormData);
    // Validate after state update
    setTimeout(() => validateDateTime(), 0);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = { ...formData, endTime: e.target.value };
    setFormData(newFormData);
    // Validate after state update
    setTimeout(() => validateDateTime(), 0);
  };

  // Helper function to convert time format
  const formatTimeForBackend = (timeStr: string): string => {
    if (!timeStr) return "";
    // If already in HH:MM:SS format, return as is
    if (timeStr.includes(":") && timeStr.split(":").length === 3) {
      return timeStr;
    }
    // Convert HH:MM to HH:MM:SS
    return timeStr + ":00";
  };

  // Helper function to convert time format for display
  const formatTimeForDisplay = (timeStr: string): string => {
    if (!timeStr) return "";
    // Convert HH:MM:SS to HH:MM for HTML time input
    if (timeStr.includes(":") && timeStr.split(":").length === 3) {
      return timeStr.substring(0, 5); // Take only HH:MM part
    }
    return timeStr;
  };

  const handleSubmit = async () => {
    if (!validateAll()) {
      return;
    }

    try {
      const ruleData = {
        ...formData,
        // Convert times to backend format
        startTime: formData.startTime ? formatTimeForBackend(formData.startTime) : null,
        endTime: formData.endTime ? formatTimeForBackend(formData.endTime) : null,
        pricingRuleId: rule?.pricingRuleId || 0
      };

      if (!rule || rule.pricingRuleId === 0) {
        createPricingRule(ruleData)
          .then(response => {
            onSave(response.data);
            console.log("Pricing rule created successfully:", response);
            onClose();
          })
          .catch(error => {
            alert('Error creating pricing rule: ' + (error.message || 'Unknown error'));
            console.error("Response status:", error.response?.status);
            console.error("Response data:", error.response?.data);
            console.error("Request data:", error.config?.data);
          });
      } else {
        updatePricingRule(rule.pricingRuleId, ruleData)
          .then(response => {
            onSave(response.data.rule);
            console.log("Pricing rule updated successfully:", response);
          })
          .catch(error => {
            alert('Error updating pricing rule: ' + (error.message || 'Unknown error'));
            console.error("Response status:", error.response?.status);
            console.error("Response data:", error.response?.data);
            console.error("Request data:", error.config?.data);
          });
      }

      onClose();
    } catch (error: any) {
      setValidationError(error.response?.data?.message || error.message || 'Failed to save pricing rule');
      console.error("Error saving pricing rule:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Request data:", error.config?.data);
    }
  };

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">{rule ? "Edit" : "Add"} Pricing Rule</h3>

      {validationError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {validationError}
        </div>
      )}

      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
          setTimeout(() => validateAll(), 0);
        }}
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

      {/* Time and Date Selection */}
      <div className="border border-gray-300 rounded p-4 mb-4">
        <h4 className="text-black font-bold uppercase mb-3">Time Period</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-semibold mb-2 text-gray-700">Start</h5>
            <DatePicker
              label="Start Date"
              value={formData.startDate || ""}
              onChange={handleStartDateChange}
            />
            <TimePicker
              label="Start Time"
              value={formatTimeForDisplay(formData.startTime || "")}
              onChange={handleStartTimeChange}
            />
          </div>
          <div>
            <h5 className="text-sm font-semibold mb-2 text-gray-700">End</h5>
            <DatePicker
              label="End Date"
              value={formData.endDate || ""}
              onChange={handleEndDateChange}
            />
            <TimePicker
              label="End Time"
              value={formatTimeForDisplay(formData.endTime || "")}
              onChange={handleEndTimeChange}
            />
          </div>
        </div>
      </div>

      <Input
        label="Price Multiplier"
        type="number"
        step={0.01}
        min="0.01"
        max="100.0"
        value={formData.priceMultiplier}
        onChange={(e) => {
          setFormData({ ...formData, priceMultiplier: Number(e.target.value) });
          setTimeout(() => validateAll(), 0);
        }}
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
        min="1"
        max="1000"
        value={formData.priority}
        onChange={(e) => {
          setFormData({ ...formData, priority: Number(e.target.value) });
          setTimeout(() => validateAll(), 0);
        }}
        required
      />
      <MultiSelect
        label="Products"
        value={formData.productIds || []}
        onChange={(ids) => setFormData({ ...formData, productIds: ids })}
        options={products.map((p) => ({ value: p.id, label: p.name }))}
      />
      <div className="flex justify-center">
        <Button
          disabled={!!validationError}
          className={validationError ? "opacity-50 cursor-not-allowed" : ""}
          onClick={handleSubmit}
        >Save</Button>
      </div>
    </div>
  );
};