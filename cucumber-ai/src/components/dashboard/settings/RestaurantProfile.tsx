"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"
// import { createClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client'
const supabase = createClient(
);


type Organization = {
    id: string;
    owner_id: string;
    name: string;
    slug: string;
    business_type: string;
    subscription_plan: string;
    subscription_status: string;
    gst_number?: string;
    fssai_license?: string;
    pan_number?: string;
    address?: any;
    contact_info?: any;
    business_hours?: any;
    timezone?: string;
    settings?: any;
    created_at: string;
    updated_at: string;
};

type Location = {
    id: string;
    organization_id: string;
    name: string;
    type: string;
    address: any;
    contact_info?: any;
    business_hours?: any;
    seating_capacity?: number;
    delivery_radius?: number;
    is_active: boolean;
    settings?: any;
    created_at: string;
    updated_at: string;
};

type OrgFormType = Partial<Organization> & { _expanded?: "address" | "contact" };

export default function RestaurantProfile() {
    const [org, setOrg] = useState<Organization | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [editOrgOpen, setEditOrgOpen] = useState(false);
    const [editLocOpen, setEditLocOpen] = useState<string | null>(null);
    const [orgForm, setOrgForm] = useState<OrgFormType>({});
    type LocFormType = Partial<Location> & { _expanded?: "address" | "contact" };
    const [locForm, setLocForm] = useState<LocFormType>({});
    // const { toast } = useToast();

    // Auth logic to get user's org id, create if not exists
    const [organizationId, setOrganizationId] = useState<string>("");

    useEffect(() => {
        const fetchOrg = async () => {
            const { data: user, error: userError } = await supabase.auth.getUser();
            console.log("User data:", user);
            if (userError || !user?.user) {
                setOrganizationId("");
                return;
            }
            const userId = user.user.id;
            // Try to find organization for user
            const { data: orgs, error: orgError } = await supabase
                .from("organizations")
                .select("*")
                .eq("owner_id", userId)
                .limit(1);
            if (orgError) {
                console.error("Error fetching organization:", orgError);
                setOrganizationId("");
                return;
            }
            if (orgs && orgs.length > 0) {
                setOrganizationId(orgs[0].id);
                console.log("Found organization:", orgs[0]);
            } else {
                // Create new organization for user
                const { data: newOrg, error: createError } = await supabase
                    .from("organizations")
                    .insert([
                        {
                            name: "My Restaurant",
                            slug: `restaurant-${userId.slice(0, 8)}`,
                            owner_id: userId,
                            business_type: "restaurant",
                            subscription_plan: "free",
                            subscription_status: "active",
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        },
                    ])
                    .select()
                    .single();
                if (createError || !newOrg) {
                    setOrganizationId("");
                } else {
                    setOrganizationId(newOrg.id);
                }
            }
        };
        fetchOrg();
    }, []);

    useEffect(() => {
        if (!organizationId) return;
        setLoading(true);
        Promise.all([
            supabase.from("organizations").select("*").eq("id", organizationId).single(),
            supabase.from("locations").select("*").eq("organization_id", organizationId),
        ]).then(([orgRes, locRes]) => {
            if (orgRes.data) setOrg(orgRes.data);
            if (locRes.data) setLocations(locRes.data);
            setLoading(false);
        });
    }, [organizationId]);

    // --- Organization Edit Handlers ---
    const openEditOrg = () => {
        setOrgForm(org || {});
        setEditOrgOpen(true);
    };
    const handleOrgChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setOrgForm({ ...orgForm, [e.target.name]: e.target.value });
    };
    const handleOrgSave = async () => {
        if (!org) return;
        const { error, data } = await supabase
            .from("organizations")
            .update({
                ...orgForm,
                updated_at: new Date().toISOString(),
            })
            .eq("id", org.id)
            .select()
            .single();
        if (error) {
            toast.error(`Error: ${error.message}`);
        } else {
            setOrg(data);
            setEditOrgOpen(false);
            toast.success("Restaurant profile updated.");
        }
    };

    // --- Location Edit Handlers ---
    const openEditLoc = (loc: Location) => {
        setLocForm(loc);
        setEditLocOpen(loc.id);
    };
    const handleLocChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocForm({ ...locForm, [e.target.name]: e.target.value });
    };
    const handleLocSave = async () => {
        if (!locForm.id) return;
        const { error, data } = await supabase
            .from("locations")
            .update({
                ...locForm,
                updated_at: new Date().toISOString(),
            })
            .eq("id", locForm.id)
            .select()
            .single();
        if (error) {
            toast.error(`Error: ${error.message}`);
        } else {
            setLocations((prev) => prev.map((l) => (l.id === data.id ? data : l)));
            setEditLocOpen(null);
            toast.success("Location updated.");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!org) return <div className="p-8">No restaurant found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Restaurant Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Restaurant Profile</CardTitle>
                    <CardDescription>View and update your restaurant&apos;s details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex flex-col gap-2">
                        <div>
                            <span className="font-semibold">Name:</span> {org.name}
                        </div>
                        <div>
                            <span className="font-semibold">Slug:</span> {org.slug}
                        </div>
                        <div>
                            <span className="font-semibold">Business Type:</span> {org.business_type}
                        </div>
                        <div>
                            <span className="font-semibold">Subscription:</span> {org.subscription_plan} ({org.subscription_status})
                        </div>
                        <div>
                            <span className="font-semibold">GST:</span> {org.gst_number || "-"}
                        </div>
                        <div>
                            <span className="font-semibold">FSSAI:</span> {org.fssai_license || "-"}
                        </div>
                        <div>
                            <span className="font-semibold">PAN:</span> {org.pan_number || "-"}
                        </div>
                        <div>
                            <span className="font-semibold">Timezone:</span> {org.timezone}
                        </div>
                        <div>
                            <span className="font-semibold">Address:</span>{" "}
                            {org.address?.address_line1
                                ? `${org.address.address_line1}, ${org.address.city || ""}, ${org.address.state || ""}, ${org.address.pincode || ""}`
                                : "-"}
                        </div>
                        <div>
                            <span className="font-semibold">Contact:</span>{" "}
                            {org.contact_info?.phone || org.contact_info?.email
                                ? `${org.contact_info.phone || ""} ${org.contact_info.email || ""}`
                                : "-"}
                        </div>
                    </div>
                    <Button className="mt-4" onClick={openEditOrg}>
                        Edit Profile
                    </Button>
                </CardContent>
            </Card>

            {/* Edit Organization Dialog */}
            <Dialog open={editOrgOpen} onOpenChange={setEditOrgOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Restaurant Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input name="name" value={orgForm.name || ""} onChange={handleOrgChange} />
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={orgForm.slug || ""}
                                onChange={handleOrgChange}
                                required
                                minLength={3}
                                maxLength={64}
                                pattern="^[a-zA-Z0-9-_]+$"
                                autoComplete="off"
                                onFocus={() => {
                                    toast.info(
                                        "Slug must be 3-64 characters, only letters, numbers, hyphens, and underscores."
                                    );
                                }}
                                style={{
                                    borderColor:
                                        orgForm.slug && /^[a-zA-Z0-9-_]{3,64}$/.test(orgForm.slug)
                                            ? "green"
                                            : orgForm.slug
                                            ? "red"
                                            : undefined,
                                }}
                            />
                            <div
                                className="text-xs mt-1"
                                style={{
                                    color:
                                        orgForm.slug && /^[a-zA-Z0-9-_]{3,64}$/.test(orgForm.slug)
                                            ? "green"
                                            : orgForm.slug
                                            ? "red"
                                            : undefined,
                                }}
                            >
                                Slug must be 3-64 characters. Only letters, numbers, hyphens (-), and underscores (_) are allowed.
                            </div>
                        </div>
                        <div>
                            <Label>GST Number</Label>
                            <Input name="gst_number" value={orgForm.gst_number || ""} onChange={handleOrgChange} />
                        </div>
                        <div>
                            <Label>FSSAI License</Label>
                            <Input name="fssai_license" value={orgForm.fssai_license || ""} onChange={handleOrgChange} />
                        </div>
                        <div>
                            <Label>PAN Number</Label>
                            <Input name="pan_number" value={orgForm.pan_number || ""} onChange={handleOrgChange} />
                        </div>
                        <div>
                            <Label>Timezone</Label>
                            <Input name="timezone" value={orgForm.timezone || ""} onChange={handleOrgChange} />
                        </div>
                        {/* Collapsible Address & Contact Info Forms */}
                        <div className="space-y-4">
                            {/* Address Collapsible */}
                            <details
                                open={orgForm._expanded === "address"}
                                onClick={() =>
                                    setOrgForm((f) => ({
                                        ...f,
                                        _expanded: f._expanded === "address" ? undefined : "address",
                                    }))
                                }
                                className="border rounded-md"
                            >
                                <summary className="cursor-pointer font-semibold px-2 py-1 bg-muted rounded-t-md">
                                    Address Details
                                </summary>
                                <div className="pl-6 pt-3 pb-2 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <Label>Address Line 1</Label>
                                            <Input
                                                name="address_line1"
                                                value={orgForm.address?.address_line1 || ""}
                                                onChange={(e) =>
                                                    setOrgForm((f) => ({
                                                        ...f,
                                                        address: { ...f.address, address_line1: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Address Line 2</Label>
                                            <Input
                                                name="address_line2"
                                                value={orgForm.address?.address_line2 || ""}
                                                onChange={(e) =>
                                                    setOrgForm((f) => ({
                                                        ...f,
                                                        address: { ...f.address, address_line2: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>City</Label>
                                            <Input
                                                name="city"
                                                value={orgForm.address?.city || ""}
                                                onChange={(e) =>
                                                    setOrgForm((f) => ({
                                                        ...f,
                                                        address: { ...f.address, city: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>State</Label>
                                            <Input
                                                name="state"
                                                value={orgForm.address?.state || ""}
                                                onChange={(e) =>
                                                    setOrgForm((f) => ({
                                                        ...f,
                                                        address: { ...f.address, state: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Pincode</Label>
                                            <Input
                                                name="pincode"
                                                value={orgForm.address?.pincode || ""}
                                                onChange={(e) =>
                                                    setOrgForm((f) => ({
                                                        ...f,
                                                        address: { ...f.address, pincode: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Country</Label>
                                            <Input
                                                name="country"
                                                value={orgForm.address?.country || ""}
                                                onChange={(e) =>
                                                    setOrgForm((f) => ({
                                                        ...f,
                                                        address: { ...f.address, country: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </details>
                            {/* Contact Info Collapsible */}
                            <details
                                open={orgForm._expanded === "contact"}
                                onClick={() =>
                                    setOrgForm((f) => ({
                                        ...f,
                                        _expanded: f._expanded === "contact" ? undefined : "contact",
                                    }))
                                }
                                className="border rounded-md"
                            >
                                <summary className="cursor-pointer font-semibold px-2 py-1 bg-muted rounded-t-md">
                                    Contact Info
                                </summary>
                                <div className="pl-6 pt-3 pb-2 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <Label>Phone</Label>
                                            <Input
                                                name="phone"
                                                value={orgForm.contact_info?.phone || ""}
                                                onChange={(e) =>
                                                    setOrgForm((f) => ({
                                                        ...f,
                                                        contact_info: { ...f.contact_info, phone: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                name="email"
                                                value={orgForm.contact_info?.email || ""}
                                                onChange={(e) =>
                                                    setOrgForm((f) => ({
                                                        ...f,
                                                        contact_info: { ...f.contact_info, email: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Website</Label>
                                            <Input
                                                name="website"
                                                value={orgForm.contact_info?.website || ""}
                                                onChange={(e) =>
                                                    setOrgForm((f) => ({
                                                        ...f,
                                                        contact_info: { ...f.contact_info, website: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleOrgSave}>Save</Button>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Locations List */}
            <Card>
                <CardHeader>
                    <CardTitle>Locations</CardTitle>
                    <CardDescription>Manage your restaurant`&apos;`s locations.</CardDescription>
                </CardHeader>
                <CardContent>
                    {locations.length === 0 && <div>No locations found.</div>}
                    <div className="space-y-4">
                        {locations.map((loc) => (
                            <div key={loc.id} className="border rounded p-4 flex flex-col gap-2">
                                <div>
                                    <span className="font-semibold">Name:</span> {loc.name}
                                </div>
                                <div>
                                    <span className="font-semibold">Type:</span> {loc.type}
                                </div>
                                <div>
                                    <span className="font-semibold">Seating Capacity:</span> {loc.seating_capacity || "-"}
                                </div>
                                <div>
                                    <span className="font-semibold">Delivery Radius:</span> {loc.delivery_radius || "-"}
                                </div>
                                <div>
                                    <span className="font-semibold">Active:</span> {loc.is_active ? "Yes" : "No"}
                                </div>
                                <div>
                                    <span className="font-semibold">Address:</span>{" "}
                                    {loc.address?.address_line1
                                        ? `${loc.address.address_line1}, ${loc.address.city || ""}, ${loc.address.state || ""}, ${loc.address.pincode || ""}`
                                        : "-"}
                                </div>
                                <div>
                                    <span className="font-semibold">Contact:</span>{" "}
                                    {loc.contact_info?.phone || loc.contact_info?.email
                                        ? `${loc.contact_info.phone || ""} ${loc.contact_info.email || ""}`
                                        : "-"}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button size="sm" onClick={() => openEditLoc(loc)}>
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={async () => {
                                            if (window.confirm("Are you sure you want to delete this location?")) {
                                                const { error } = await supabase.from("locations").delete().eq("id", loc.id);
                                                if (error) {
                                                    toast.error(`Error: ${error.message}`);
                                                } else {
                                                    setLocations((prev) => prev.filter((l) => l.id !== loc.id));
                                                    toast.success("Location deleted.");
                                                }
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                                <Separator />
                                {/* Edit Location Dialog */}
                                <Dialog open={editLocOpen === loc.id} onOpenChange={() => setEditLocOpen(null)}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Location</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Name</Label>
                                                    <Input name="name" value={locForm.name || ""} onChange={handleLocChange} />
                                                </div>
                                                <div>
                                                    <Label>Type</Label>
                                                    <Input name="type" value={locForm.type || ""} onChange={handleLocChange} />
                                                </div>
                                                <div>
                                                    <Label>Seating Capacity</Label>
                                                    <Input
                                                        name="seating_capacity"
                                                        type="number"
                                                        value={locForm.seating_capacity || ""}
                                                        onChange={handleLocChange}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Delivery Radius (meters)</Label>
                                                    <Input
                                                        name="delivery_radius"
                                                        type="number"
                                                        value={locForm.delivery_radius || ""}
                                                        onChange={handleLocChange}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Label>Active</Label>
                                                    <Input
                                                        name="is_active"
                                                        type="checkbox"
                                                        checked={!!locForm.is_active}
                                                        onChange={(e) => setLocForm({ ...locForm, is_active: e.target.checked })}
                                                        className="w-4 h-4"
                                                    />
                                                </div>
                                            </div>
                                            {/* Collapsible Address & Contact Info Forms */}
                                            <div className="space-y-4">
                                                {/* Address Collapsible */}
                                                <details
                                                    open={locForm._expanded === "address"}
                                                    onClick={() =>
                                                        setLocForm((f) => ({
                                                            ...f,
                                                            _expanded: f._expanded === "address" ? undefined : "address",
                                                        }))
                                                    }
                                                    className="border rounded-md"
                                                >
                                                    <summary className="cursor-pointer font-semibold px-2 py-1 bg-muted rounded-t-md">
                                                        Address Details
                                                    </summary>
                                                    <div className="pl-6 pt-3 pb-2 space-y-3">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <Label>Address Line 1</Label>
                                                                <Input
                                                                    name="address_line1"
                                                                    value={locForm.address?.address_line1 || ""}
                                                                    onChange={(e) =>
                                                                        setLocForm((f) => ({
                                                                            ...f,
                                                                            address: { ...f.address, address_line1: e.target.value },
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Address Line 2</Label>
                                                                <Input
                                                                    name="address_line2"
                                                                    value={locForm.address?.address_line2 || ""}
                                                                    onChange={(e) =>
                                                                        setLocForm((f) => ({
                                                                            ...f,
                                                                            address: { ...f.address, address_line2: e.target.value },
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>City</Label>
                                                                <Input
                                                                    name="city"
                                                                    value={locForm.address?.city || ""}
                                                                    onChange={(e) =>
                                                                        setLocForm((f) => ({
                                                                            ...f,
                                                                            address: { ...f.address, city: e.target.value },
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>State</Label>
                                                                <Input
                                                                    name="state"
                                                                    value={locForm.address?.state || ""}
                                                                    onChange={(e) =>
                                                                        setLocForm((f) => ({
                                                                            ...f,
                                                                            address: { ...f.address, state: e.target.value },
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Pincode</Label>
                                                                <Input
                                                                    name="pincode"
                                                                    value={locForm.address?.pincode || ""}
                                                                    onChange={(e) =>
                                                                        setLocForm((f) => ({
                                                                            ...f,
                                                                            address: { ...f.address, pincode: e.target.value },
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Country</Label>
                                                                <Input
                                                                    name="country"
                                                                    value={locForm.address?.country || ""}
                                                                    onChange={(e) =>
                                                                        setLocForm((f) => ({
                                                                            ...f,
                                                                            address: { ...f.address, country: e.target.value },
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </details>
                                                {/* Contact Info Collapsible */}
                                                <details
                                                    open={locForm._expanded === "contact"}
                                                    onClick={() =>
                                                        setLocForm((f) => ({
                                                            ...f,
                                                            _expanded: f._expanded === "contact" ? undefined : "contact",
                                                        }))
                                                    }
                                                    className="border rounded-md"
                                                >
                                                    <summary className="cursor-pointer font-semibold px-2 py-1 bg-muted rounded-t-md">
                                                        Contact Info
                                                    </summary>
                                                    <div className="pl-6 pt-3 pb-2 space-y-3">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <Label>Phone</Label>
                                                                <Input
                                                                    name="phone"
                                                                    value={locForm.contact_info?.phone || ""}
                                                                    onChange={(e) =>
                                                                        setLocForm((f) => ({
                                                                            ...f,
                                                                            contact_info: { ...f.contact_info, phone: e.target.value },
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Email</Label>
                                                                <Input
                                                                    name="email"
                                                                    value={locForm.contact_info?.email || ""}
                                                                    onChange={(e) =>
                                                                        setLocForm((f) => ({
                                                                            ...f,
                                                                            contact_info: { ...f.contact_info, email: e.target.value },
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Website</Label>
                                                                <Input
                                                                    name="website"
                                                                    value={locForm.contact_info?.website || ""}
                                                                    onChange={(e) =>
                                                                        setLocForm((f) => ({
                                                                            ...f,
                                                                            contact_info: { ...f.contact_info, website: e.target.value },
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </details>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleLocSave}>Save</Button>
                                            <DialogClose asChild>
                                                <Button variant="secondary">Cancel</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))}
                    </div>
                    {/* Add Location Button and Dialog */}
                    <Button className="mt-4" onClick={() => {
                        setLocForm({
                            name: "",
                            type: "",
                            seating_capacity: undefined,
                            delivery_radius: undefined,
                            is_active: true,
                            address: {},
                            contact_info: {},
                            _expanded: undefined,
                        });
                        setEditLocOpen("new");
                    }}>
                        Add Location
                    </Button>
                    <Dialog open={editLocOpen === "new"} onOpenChange={() => setEditLocOpen(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Location</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Name</Label>
                                        <Input name="name" value={locForm.name || ""} onChange={handleLocChange} />
                                    </div>
                                    <div>
                                        <Label>Type</Label>
                                        <Input name="type" value={locForm.type || ""} onChange={handleLocChange} />
                                    </div>
                                    <div>
                                        <Label>Seating Capacity</Label>
                                        <Input
                                            name="seating_capacity"
                                            type="number"
                                            value={locForm.seating_capacity || ""}
                                            onChange={handleLocChange}
                                        />
                                    </div>
                                    <div>
                                        <Label>Delivery Radius (meters)</Label>
                                        <Input
                                            name="delivery_radius"
                                            type="number"
                                            value={locForm.delivery_radius || ""}
                                            onChange={handleLocChange}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Label>Active</Label>
                                        <Input
                                            name="is_active"
                                            type="checkbox"
                                            checked={!!locForm.is_active}
                                            onChange={(e) => setLocForm({ ...locForm, is_active: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                </div>
                                {/* Collapsible Address & Contact Info Forms */}
                                <div className="space-y-4">
                                    {/* Address Collapsible */}
                                    <details
                                        open={locForm._expanded === "address"}
                                        onClick={() =>
                                            setLocForm((f) => ({
                                                ...f,
                                                _expanded: f._expanded === "address" ? undefined : "address",
                                            }))
                                        }
                                        className="border rounded-md"
                                    >
                                        <summary className="cursor-pointer font-semibold px-2 py-1 bg-muted rounded-t-md">
                                            Address Details
                                        </summary>
                                        <div className="pl-6 pt-3 pb-2 space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <Label>Address Line 1</Label>
                                                    <Input
                                                        name="address_line1"
                                                        value={locForm.address?.address_line1 || ""}
                                                        onChange={(e) =>
                                                            setLocForm((f) => ({
                                                                ...f,
                                                                address: { ...f.address, address_line1: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Address Line 2</Label>
                                                    <Input
                                                        name="address_line2"
                                                        value={locForm.address?.address_line2 || ""}
                                                        onChange={(e) =>
                                                            setLocForm((f) => ({
                                                                ...f,
                                                                address: { ...f.address, address_line2: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>City</Label>
                                                    <Input
                                                        name="city"
                                                        value={locForm.address?.city || ""}
                                                        onChange={(e) =>
                                                            setLocForm((f) => ({
                                                                ...f,
                                                                address: { ...f.address, city: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>State</Label>
                                                    <Input
                                                        name="state"
                                                        value={locForm.address?.state || ""}
                                                        onChange={(e) =>
                                                            setLocForm((f) => ({
                                                                ...f,
                                                                address: { ...f.address, state: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Pincode</Label>
                                                    <Input
                                                        name="pincode"
                                                        value={locForm.address?.pincode || ""}
                                                        onChange={(e) =>
                                                            setLocForm((f) => ({
                                                                ...f,
                                                                address: { ...f.address, pincode: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Country</Label>
                                                    <Input
                                                        name="country"
                                                        value={locForm.address?.country || ""}
                                                        onChange={(e) =>
                                                            setLocForm((f) => ({
                                                                ...f,
                                                                address: { ...f.address, country: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                    {/* Contact Info Collapsible */}
                                    <details
                                        open={locForm._expanded === "contact"}
                                        onClick={() =>
                                            setLocForm((f) => ({
                                                ...f,
                                                _expanded: f._expanded === "contact" ? undefined : "contact",
                                            }))
                                        }
                                        className="border rounded-md"
                                    >
                                        <summary className="cursor-pointer font-semibold px-2 py-1 bg-muted rounded-t-md">
                                            Contact Info
                                        </summary>
                                        <div className="pl-6 pt-3 pb-2 space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <Label>Phone</Label>
                                                    <Input
                                                        name="phone"
                                                        value={locForm.contact_info?.phone || ""}
                                                        onChange={(e) =>
                                                            setLocForm((f) => ({
                                                                ...f,
                                                                contact_info: { ...f.contact_info, phone: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Email</Label>
                                                    <Input
                                                        name="email"
                                                        value={locForm.contact_info?.email || ""}
                                                        onChange={(e) =>
                                                            setLocForm((f) => ({
                                                                ...f,
                                                                contact_info: { ...f.contact_info, email: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Website</Label>
                                                    <Input
                                                        name="website"
                                                        value={locForm.contact_info?.website || ""}
                                                        onChange={(e) =>
                                                            setLocForm((f) => ({
                                                                ...f,
                                                                contact_info: { ...f.contact_info, website: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={async () => {
                                        if (!organizationId) return;
                                        const { error, data } = await supabase
                                            .from("locations")
                                            .insert([
                                                {
                                                    organization_id: organizationId,
                                                    name: locForm.name,
                                                    type: locForm.type,
                                                    seating_capacity: locForm.seating_capacity ? Number(locForm.seating_capacity) : null,
                                                    delivery_radius: locForm.delivery_radius ? Number(locForm.delivery_radius) : null,
                                                    is_active: !!locForm.is_active,
                                                    address: locForm.address || {},
                                                    contact_info: locForm.contact_info || {},
                                                    created_at: new Date().toISOString(),
                                                    updated_at: new Date().toISOString(),
                                                },
                                            ])
                                            .select()
                                            .single();
                                        if (error) {
                                            toast.error(`Error: ${error.message}`);
                                        } else {
                                            setLocations((prev) => [...prev, data]);
                                            setEditLocOpen(null);
                                            toast.success("Location added.");
                                        }
                                    }}
                                >
                                    Save
                                </Button>
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}