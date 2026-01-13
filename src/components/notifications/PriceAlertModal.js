PriceAlertModal.jsimport React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, TrendingUp, TrendingDown } from "lucide-react";

export default function PriceAlertModal({ isOpen, onClose, onSave }) {
  const [alertData, setAlertData] = useState({
    target_rate: '',
    alert_type: 'above'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(alertData);
    setAlertData({ target_rate: '', alert_type: 'above' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            Set Price Alert
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Alert When Price Goes</Label>
            <Select
              value={alertData.alert_type}
              onValueChange={(value) => setAlertData({ ...alertData, alert_type: value })}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="above">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Above Target
                  </div>
                </SelectItem>
                <SelectItem value="below">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    Below Target
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Target Rate (₹)</Label>
            <Input
Add PriceAlertModal component              step="0.01"
              placeholder="84.50"
              value={alertData.target_rate}
              onChange={(e) => setAlertData({ ...alertData, target_rate: e.target.value })}
              className="bg-slate-700/50 border-slate-600 text-white"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Create Alert
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
