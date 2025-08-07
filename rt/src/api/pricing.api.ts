import { IBackendRes, IPricingRule } from "../types/backend";
import instance from "../config/axios-customize";

export const PricingService = {
  getPricingRules: (): Promise<Required<IBackendRes<IPricingRule[]>>> => {
    return instance.get('/api/pricing/rules');
  },

  createPricingRule: (ruleData: any): Promise<IPricingRule> => {
    return instance.post('/api/pricing/rules', ruleData);
  },

  updatePricingRule: (ruleId: number, ruleData: IPricingRule): Promise<IBackendRes<IPricingRule>> => {
    console.log("Updating Pricing Rule:", ruleData);
    return instance.put(`/api/pricing/rules/${ruleId}`, ruleData);
  },

  deletePricingRule: (ruleId: number): Promise<{ success: boolean }> => {
    return instance.delete(`/api/pricing/rules/${ruleId}`);
  },

  applyPricingRule: (cartId: number, ruleId: number): Promise<any> => {
    return instance.post(`/api/cart/${cartId}/apply-rule`, { ruleId });
  },

  removePricingRule: (cartId: number, ruleId: number): Promise<{ success: boolean }> => {
    return instance.delete(`/api/cart/${cartId}/remove-rule/${ruleId}`);
  },

  getPricingRuleDetails: (ruleId: number): Promise<IPricingRule> => {
    return instance.get(`/api/pricing/rules/${ruleId}`);
  },

  getPricingRuleHistory: (): Promise<any[]> => {
    return instance.get('/api/pricing/rules/history');
  },

  getPricingRuleById: (ruleId: number): Promise<IPricingRule> => {
    return instance.get(`/api/pricing/rules/${ruleId}`);
  },
};
