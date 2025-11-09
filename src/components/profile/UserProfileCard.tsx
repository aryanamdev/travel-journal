import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle2, Archive, ShoppingBag, LogOut, MoreHorizontal } from "lucide-react";

type Me = {
  id?: string;
  fullName: string;
  email: string;
  isVerified?: boolean;
};

type Props = {
  user: Me;
  onSave?: (user: Me) => void;
  onLogout?: (onLoading :(loading: boolean) => void) => void ;
  onArchive?: () => void;
  className?: string;
};

const ViewerProfileCard: React.FC<Props> = ({ user, onSave, onLogout, onArchive, className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Me>({ ...user });
  const toggleEdit = () => setIsEditing((s) => !s);

  const handleChange = (k: keyof Me, v: any) => setForm((s) => ({ ...s, [k]: v }));
  const handleSave = () => {
    onSave?.(form);
    setIsEditing(false);
  };

  const onLoading = (loading: boolean) => {
    setLoading(loading)
  }

  return (
    <div className={`w-full ${className}`}>
      <Card className="overflow-hidden">
        <CardHeader className="relative p-0 bg-transparent">
          {/* cover */}
          <div className="h-28 bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400" />

          {/* header content */}
          <div className="absolute left-4 right-4 -bottom-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 ring-4 ring-background shadow-sm">
                {/* {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                ) : ( */}
                  <AvatarFallback>{user.fullName?.[0] ?? "U"}</AvatarFallback>
                {/* )} */}
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg leading-tight">{user.fullName}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    Me
                  </Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground">{user.email}</CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={toggleEdit}>
                {isEditing ? "Cancel" : "Edit"}
              </Button>

              <Button variant="outline" size="sm" onClick={() => onLogout?.(onLoading)} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{loading ? "Loading..." : "Logout"}</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-14">
          {/* responsive stats */}

          {/* form */}
          <div className="mt-6 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} readOnly={!isEditing} />
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input id="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} readOnly={!isEditing} />
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${user.isVerified ? "text-green-500" : "text-muted-foreground"}`} />
                  {user.isVerified ? "Verified" : "Not verified"}
                </div>
              </div>


              <div className="sm:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" value={(form as any).bio ?? ""} onChange={(e) => handleChange("bio" as any, e.target.value)} readOnly={!isEditing} />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 p-4 border-t">
          <div className="flex-1 text-xs text-muted-foreground sm:text-right">{user.email}</div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => { setForm({ ...user }); setIsEditing(false); }}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save changes</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={toggleEdit}>Edit profile</Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ViewerProfileCard;