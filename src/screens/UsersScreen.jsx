import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Plus, MoreVertical, Eye, Edit } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Dummy data for demonstration
const usersData = {
  hotelPartners: {
    owners: [
      { id: 1, name: "Alice Smith", email: "alice@yomstay.com", role: "Owner", hotel: "Grand Palace" },
      { id: 2, name: "Bob Lee", email: "bob@yomstay.com", role: "Owner", hotel: "City Lights Inn" },
    ],
    staff: [
      { id: 3, name: "Charlie Kim", email: "charlie@yomstay.com", role: "Receptionist", hotel: "Seaside Resort" },
      { id: 4, name: "Dana White", email: "dana@yomstay.com", role: "Manager", hotel: "Grand Palace" },
    ],
  },
  customers: [
    { id: 5, name: "Eve Adams", email: "eve@gmail.com", bookings: 12 },
    { id: 6, name: "Frank Green", email: "frank@gmail.com", bookings: 7 },
  ],
};

const hotels = [
  { id: 1, name: "Grand Palace" },
  { id: 2, name: "City Lights Inn" },
  { id: 3, name: "Seaside Resort" },
];

const TABS = ["Hotel Partners", "Customers"];
const PARTNER_TABS = ["Owners", "Staff"];

export default function UsersScreen() {
  const [tab, setTab] = useState(TABS[0]);
  const [partnerTab, setPartnerTab] = useState(PARTNER_TABS[0]);
  const [selected, setSelected] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [sendInvite, setSendInvite] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [searchHotel, setSearchHotel] = useState("");

  // Add/Edit User form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    hotel: "",
    userType: "Hotel Partner", // or Customer
    role: partnerTab,
  });

  // Get current data based on tab
  let tableData = [];
  if (tab === "Hotel Partners") {
    tableData = usersData.hotelPartners[partnerTab.toLowerCase()];
  } else {
    tableData = usersData.customers;
  }

  // Handle select all/individual
  const allSelected = tableData.length > 0 && selected.length === tableData.length;
  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : tableData.map((u) => u.id));
  };
  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  // Dummy export handler
  const handleExport = () => {
    alert("Exporting selected users: " + selected.join(", "));
  };

  // Dummy bulk actions
  const handleBulkDelete = () => {
    alert("Deleting users: " + selected.join(", "));
  };
  const handleBulkReset = () => {
    alert("Sending password reset to: " + selected.join(", "));
  };

  // Add User form handlers
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleHotelSearch = (e) => {
    setSearchHotel(e.target.value);
  };
  const filteredHotels = hotels.filter((h) => h.name.toLowerCase().includes(searchHotel.toLowerCase()));

  // Add User
  const handleAddUser = (e) => {
    e.preventDefault();
    alert("User added! (simulate API call)");
    setAddOpen(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", password: "", hotel: "", userType: tab, role: partnerTab });
    setSelectedHotel("");
    setSearchHotel("");
    setSendInvite(true);
  };

  // Edit User
  const handleEditUser = (user) => {
    setEditUser(user);
    setEditOpen(true);
    // Pre-fill form
    setForm({
      firstName: user.name?.split(" ")[0] || "",
      lastName: user.name?.split(" ").slice(1).join(" ") || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      hotel: hotels.find(h => h.name === user.hotel)?.id || "",
      userType: tab,
      role: user.role || "",
    });
    setSelectedHotel(hotels.find(h => h.name === user.hotel)?.id || "");
    setSearchHotel("");
    setSendInvite(true);
  };
  const handleUpdateUser = (e) => {
    e.preventDefault();
    alert("User updated! (simulate API call)");
    setEditOpen(false);
    setEditUser(null);
    setForm({ firstName: "", lastName: "", email: "", phone: "", password: "", hotel: "", userType: tab, role: partnerTab });
    setSelectedHotel("");
    setSearchHotel("");
    setSendInvite(true);
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((t) => (
          <Button
            key={t}
            variant={tab === t ? "default" : "outline"}
            onClick={() => { setTab(t); setSelected([]); }}
            className="capitalize"
          >
            {t}
          </Button>
        ))}
      </div>
      {/* Secondary Tabs for Hotel Partners */}
      {tab === "Hotel Partners" && (
        <div className="flex flex-wrap gap-2 mb-4">
          {PARTNER_TABS.map((pt) => (
            <Button
              key={pt}
              variant={partnerTab === pt ? "default" : "outline"}
              onClick={() => { setPartnerTab(pt); setSelected([]); }}
              className="capitalize"
            >
              {pt}
            </Button>
          ))}
        </div>
      )}
      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Button variant="primary" onClick={() => setAddOpen(true)} className="gap-2"><Plus size={16} /> Add User</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" disabled={selected.length === 0} className="gap-2"><MoreVertical size={16} /> Bulk Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleBulkDelete}>Delete Selected</DropdownMenuItem>
            <DropdownMenuItem onClick={handleBulkReset}>Send Password Reset</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}><Download size={16} /> Export</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-sm text-muted-foreground ml-2">{selected.length} selected</span>
      </div>
      {/* Table */}
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              {tab === "Hotel Partners" && <TableHead>Role</TableHead>}
              {tab === "Hotel Partners" && <TableHead>Hotel</TableHead>}
              {tab === "Customers" && <TableHead>Bookings</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={tab === "Hotel Partners" ? 6 : 5} className="text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((user) => (
                <TableRow key={user.id} className={selected.includes(user.id) ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox checked={selected.includes(user.id)} onCheckedChange={() => toggleSelect(user.id)} />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  {tab === "Hotel Partners" && <TableCell>{user.role}</TableCell>}
                  {tab === "Hotel Partners" && <TableCell>{user.hotel}</TableCell>}
                  {tab === "Customers" && <TableCell>{user.bookings}</TableCell>}
                  <TableCell>
                    <Button variant="ghost" size="icon" className="mr-1"><Eye size={16} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}><Edit size={16} /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      {/* Add User Modal */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader>
            <SheetTitle>Add User</SheetTitle>
          </SheetHeader>
          <form className="flex flex-col gap-4 p-2" onSubmit={handleAddUser}>
            <div className="flex gap-2">
              <Button type="button" variant={form.userType === "Hotel Partner" ? "default" : "outline"} onClick={() => setForm(f => ({ ...f, userType: "Hotel Partner" }))}>Hotel Partner</Button>
              <Button type="button" variant={form.userType === "Customer" ? "default" : "outline"} onClick={() => setForm(f => ({ ...f, userType: "Customer" }))}>Customer</Button>
            </div>
            <div className="flex gap-2">
              <Input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleFormChange} required />
              <Input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleFormChange} required />
            </div>
            <Input name="email" placeholder="Email" type="email" value={form.email} onChange={handleFormChange} required />
            <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleFormChange} required />
            {form.userType === "Hotel Partner" && (
              <>
                <div className="flex gap-2 items-center">
                  <Checkbox id="sendInvite" checked={sendInvite} onCheckedChange={() => setSendInvite(v => !v)} />
                  <label htmlFor="sendInvite" className="text-sm cursor-pointer select-none">Send invite link to user</label>
                </div>
                {!sendInvite && (
                  <Input name="password" placeholder="Password" type="password" value={form.password} onChange={handleFormChange} required />
                )}
                <div>
                  <Input placeholder="Search Hotel" value={searchHotel} onChange={handleHotelSearch} />
                  <div className="max-h-32 overflow-y-auto border rounded mt-1 bg-background">
                    {filteredHotels.map(hotel => (
                      <div key={hotel.id} className={`px-2 py-1 cursor-pointer hover:bg-muted ${selectedHotel === hotel.id ? "bg-muted" : ""}`} onClick={() => { setSelectedHotel(hotel.id); setForm(f => ({ ...f, hotel: hotel.id })); }}>
                        {hotel.name}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <SheetFooter>
              <Button type="submit" className="w-full">Add User</Button>
              <SheetClose asChild>
                <Button type="button" variant="outline" className="w-full">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      {/* Edit User Modal */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
          </SheetHeader>
          <form className="flex flex-col gap-4 p-2" onSubmit={handleUpdateUser}>
            <div className="flex gap-2">
              <Button type="button" variant={form.userType === "Hotel Partner" ? "default" : "outline"} disabled>Hotel Partner</Button>
              <Button type="button" variant={form.userType === "Customer" ? "default" : "outline"} disabled>Customer</Button>
            </div>
            <div className="flex gap-2">
              <Input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleFormChange} required />
              <Input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleFormChange} required />
            </div>
            <Input name="email" placeholder="Email" type="email" value={form.email} onChange={handleFormChange} required />
            <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleFormChange} required />
            {form.userType === "Hotel Partner" && (
              <>
                <div className="flex gap-2 items-center">
                  <Checkbox id="sendInviteEdit" checked={sendInvite} onCheckedChange={() => setSendInvite(v => !v)} />
                  <label htmlFor="sendInviteEdit" className="text-sm cursor-pointer select-none">Send invite link to user</label>
                </div>
                {!sendInvite && (
                  <Input name="password" placeholder="Password" type="password" value={form.password} onChange={handleFormChange} />
                )}
                <div>
                  <Input placeholder="Search Hotel" value={searchHotel} onChange={handleHotelSearch} />
                  <div className="max-h-32 overflow-y-auto border rounded mt-1 bg-background">
                    {filteredHotels.map(hotel => (
                      <div key={hotel.id} className={`px-2 py-1 cursor-pointer hover:bg-muted ${selectedHotel === hotel.id ? "bg-muted" : ""}`} onClick={() => { setSelectedHotel(hotel.id); setForm(f => ({ ...f, hotel: hotel.id })); }}>
                        {hotel.name}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <SheetFooter>
              <Button type="submit" className="w-full">Update User</Button>
              <SheetClose asChild>
                <Button type="button" variant="outline" className="w-full">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
