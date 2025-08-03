import React, { useState } from "react";
import { Input } from "../../Input";
import { Button } from "../../Button";
import { IUserSummaryLoyalty } from "../../../types/backend";
import { updateUserLoyaltyPoints } from "../../../config/api";

interface LoyaltyFormProps {
  user: IUserSummaryLoyalty;
  onSave: (data: IUserSummaryLoyalty) => void;
  onClose: () => void;
}

export const LoyaltyForm: React.FC<LoyaltyFormProps> = ({ user, onSave, onClose }) => {
  const [newPointsValue, setNewPointsValue] = useState(user.currentPoints);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (newPointsValue < 0) {
        setError("Points cannot be negative");
        return;
      }

      const response = await updateUserLoyaltyPoints(user.userId, newPointsValue);
      onSave(response.data);
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Failed to update loyalty points');
      console.error("Error updating loyalty points:", error);
    } finally {
      setLoading(false);
    }
  };

  const pointsDifference = newPointsValue - user.currentPoints;

  return (
    <div>
      <h3 className="text-black font-bold uppercase text-lg mb-4">Update Loyalty Points</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h4 className="font-semibold mb-2">User Information</h4>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Username:</strong> {user.userName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Current Points:</strong> <span className="text-green-600 font-semibold">{user.currentPoints}</span></p>
        <p><strong>Total Earned:</strong> {user.totalEarned}</p>
        <p><strong>Total Redeemed:</strong> {user.totalRedeemed}</p>
      </div>

      <Input
        label="New Points Value"
        type="number"
        min="0"
        value={newPointsValue}
        onChange={(e) => setNewPointsValue(Number(e.target.value))}
        required
      />

      {pointsDifference !== 0 && (
        <div className={`mb-4 p-3 rounded ${pointsDifference > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <p className="font-semibold">
            Points Change: {pointsDifference > 0 ? '+' : ''}{pointsDifference}
          </p>
          <p className="text-sm">
            {pointsDifference > 0 
              ? `This will add ${pointsDifference} points to the user's account.`
              : `This will remove ${Math.abs(pointsDifference)} points from the user's account.`
            }
          </p>
        </div>
      )}

      <div className="flex justify-center gap-2">
        <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading || pointsDifference === 0}>
          {loading ? "Updating..." : "Update Points"}
        </Button>
      </div>
    </div>
  );
};
