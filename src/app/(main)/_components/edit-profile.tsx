"use client";

import { useState } from "react";

import { UserDataType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "./edit-profile-dialog";

interface EditProfileProps {
  user: UserDataType;
}

export const EditProfile = ({ user }: EditProfileProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {" "}
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit Profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};
