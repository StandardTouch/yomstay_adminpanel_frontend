import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserActions = ({ onAddUser, onBulkDelete, onExport, selectedCount }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {/* Add User Button */}
        <Button onClick={onAddUser} className="gap-2">
          <Plus size={16} />
          Add User
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onBulkDelete} className="text-red-600">
                <Trash2 size={16} className="mr-2" />
                Delete Selected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <Download size={16} className="mr-2" />
                Export Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default UserActions;
