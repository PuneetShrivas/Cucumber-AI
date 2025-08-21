"use client"
import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Filter, Edit, Trash2, ImageIcon, DollarSign, Package, IndianRupee } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { set } from 'zod';
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Fuse from "fuse.js"


export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [locationId, setLocationId] = useState<string | null>(null)

  useEffect(() => {
    const activeLocation = localStorage.getItem("activeLocation")
    if (activeLocation) {
      setLocationId(activeLocation)
    }
  }, [])
  const [showAddItem, setShowAddItem] = useState(false)
  const [editingItem, setEditingItem] = useState<{
    name: string
    description: string
    price: string
    category_id: string
    image_url: string
    is_available: boolean
    [key: string]: any
  } | null>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
    is_available: true
  })
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [locations, setLocations] = useState<any[]>([])

  useEffect(() => {
    fetchMenuData()

  }, [locationId])
  useEffect(() => {
    console.log("editingItem:", editingItem)
    const fetchLocations = async () => {
      const organizationId = localStorage.getItem("organizationId")
      if (!organizationId) return

      const { data, error } = await supabase
        .from("locations")
        .select("id, name")
        .eq("organization_id", organizationId);
      console.log("locations in fetch:", data)
      if (!error && data) {
        setLocations(data)
      }
    }
    if (locations.length === 0) {
      fetchLocations()
    }
  }, [editingItem, showAddItem])

  const fetchMenuData = async () => {
    const { data: items, error } = await supabase
      .from("menu_items")
      .select(`
        id, name, description, image_url,
        category_id,
        price,

        menu_item_locations!inner(menu_item_id, location_id, is_available, price_override),
        menu_categories:category_id(name)
      `)
      .eq("menu_item_locations.location_id", locationId)

    if (error) {
      console.error("Error loading menu items:", error)
      return
    }

    setMenuItems(items || [])

    const { data: cats } = await supabase
      .from("menu_categories")
      .select("id, name")
      .eq("is_active", true)

    if (cats) setCategories([{ id: "all", name: "All Categories" }, ...cats])
  }

  const resetForm = () => {
    setShowAddItem(false)
    setEditingItem(null)
    setNewItem({
      name: "",
      description: "",
      price: "",
      category_id: "",
      image_url: "",
      is_available: true
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const organizationId = localStorage.getItem("organizationId")
    const payload = {
      ...newItem,
      price: parseFloat(newItem.price),
      organization_id: organizationId,
      category_id: newItem.category_id
    }

    if (editingItem) {
      const payload = {
        name: editingItem.name,
        description: editingItem.description,
        price: parseFloat(editingItem.price),
        category_id: editingItem.category_id,
        image_url: editingItem.image_url,
        is_available: editingItem.is_available
      }
      await supabase.from("menu_items").update(payload).eq("id", editingItem.id)
    } else {
      // await supabase.from("menu_items").insert([payload])
      // Insert into menu_item_locations for each selected location
      const { data: insertedMenuItems, error: insertError } = await supabase
        .from("menu_items")
        .insert([payload])
        .select("id")
        .single()

      if (insertError || !insertedMenuItems) {
        console.error("Error inserting menu item:", insertError)
        return
      }

      const menuItemId = insertedMenuItems.id

      const menuItemLocationsPayload = selectedLocations.map((locationId) => ({
        menu_item_id: menuItemId,
        location_id: locationId,
        is_available: newItem.is_available,
        price_override: parseFloat(newItem.price)
      }))

      await supabase.from("menu_item_locations").insert(menuItemLocationsPayload)
    }

    await fetchMenuData()
    resetForm()
  }
  const filteredItems = menuItems.filter((item) => {
    // const matchesSearch =
    //   item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const fuse = new Fuse(menuItems, {
      keys: ["name", "description"],
      threshold: 0.2,
      ignoreLocation: true,
      shouldSort: true
    })

    const searchResults =
      searchQuery.trim() === ""
      ? menuItems
      : fuse.search(searchQuery).map((result) => result.item)
    const matchesSearch = searchResults.some((searchItem) => searchItem.id === item.id)
    const matchesCategory = categoryFilter === "all" || item.category_id === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col @md:flex-row justify-between items-start @md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Menu Items</h1>
            <p className="text-muted-foreground">Manage all items available for this location</p>
          </div>
          <Button onClick={() => setShowAddItem(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col @md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full @md:w-60">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
              <div className="px-2 py-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => window.location.href = "/dashboard/menu-management/items-categories"}
                >
                  + Add New Category
                </Button>
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Grid of Menu Items */}
        <div className="grid grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 xl:grid-cols-4 gap-x gap-6">
          <AnimatePresence mode="wait">
            {filteredItems.map((item) => {
              const availability = item.menu_item_locations?.[0]?.is_available ?? true
              const price = item.menu_item_locations?.[0]?.price_override ?? 0
              const categoryName = item.menu_categories?.name ?? "Uncategorized"

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="shadow-sm transition hover:shadow-md border gap-0 overflow-hidden py-0">
                    <div className="relative h-40 @sm:h-48 @md:h-56 @lg:h-64">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <ImageIcon className="w-8 h-8 @md:w-10 @md:h-10 text-muted-foreground" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-emerald-100 text-emerald-800">Available</Badge>
                        <Badge className="bg-slate-100 text-slate-800 capitalize">
                          {categoryName}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <Tooltip>
                          <TooltipTrigger className="w-fit text-left text-base font-semibold line-clamp-1 overflow-hidden">
                            {item.name}
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="w-fit">{item.name}</span>

                          </TooltipContent>

                        </Tooltip>

                        <span className="text-emerald-600 font-semibold text-base">
                          ₹{parseFloat(price).toFixed(2)}
                        </span>
                      </div>



                      <p className="text-sm text-muted-foreground leading-tight line-clamp-2 h-9 overflow-hidden">
                        {item.description || "\u00A0"}
                      </p>


                      <div className="flex flex-wrap gap-2 w-full justify-between pt-2">
                        <div className="flex items-center space-x-2 w-full">
                          <Switch checked={availability} disabled />
                          <Label className="text-sm">Available</Label>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setEditingItem(item)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>

                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Menu Items Found</h3>
            <p className="text-sm text-muted-foreground">
              Try changing the search or filters to find items.
            </p>
          </div>
        )}
      </div>
      <Dialog open={showAddItem} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (selectedLocations.length === 0) {
                alert("Please select at least one location.")
                return
              }
              await handleSubmit(e)
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newItem.category_id}
                  onValueChange={(categoryId) => setNewItem({ ...newItem, category_id: categoryId })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat.id !== "all")
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image</Label>
                <div className="flex flex-col gap-2 @md:flex-row @md:items-center">
                  <div className="relative flex-shrink-0">
                    <label
                      htmlFor="menu-image-upload"
                      className="cursor-pointer"
                      style={{ display: "flex", alignItems: "center" }}
                      title={newItem.image_url ? "Click to change image" : "Upload image"}
                    >
                      {file ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Selected"
                          className="w-16 h-16 object-cover rounded border hover:opacity-80 transition"
                          style={{ width: "64px", height: "64px", objectFit: "cover" }}
                        />
                      ) : newItem.image_url ? (
                        <img
                          src={newItem.image_url}
                          alt="Menu Item"
                          className="w-16 h-16 object-cover rounded border hover:opacity-80 transition"
                          style={{ width: "64px", height: "64px", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-muted rounded border hover:bg-slate-200 transition">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        id="menu-image-upload"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            if (!file) return
                            const fileExt = file.name.split('.').pop()
                            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
                            setFileName(fileName)
                          }
                        }}
                      />
                    </label>
                    {(file || newItem.image_url) && (
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                        style={{ transform: "translate(40%, -40%)" }}
                        onClick={() => {
                          setFile(null)
                          setFileName("")
                          setNewItem({ ...newItem, image_url: "" })
                        }}
                        aria-label="Remove image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <Input
                      id="image_url"
                      value={newItem.image_url}
                      onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                      placeholder="Paste image URL"
                      className="w-full"
                      style={{ width: "150px" }}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          if (!file) {
                            alert("Please select an image file first.")
                            return
                          }
                          const { data, error } = await supabase.storage
                            .from("menu-items")
                            .upload(fileName, file, { upsert: true })
                          if (error) {
                            alert("Image upload failed")
                            return
                          }
                          const { data: publicUrlData } = supabase.storage
                            .from("menu-items")
                            .getPublicUrl(fileName)
                          setNewItem({ ...newItem, image_url: publicUrlData.publicUrl })
                        }
                        }
                        disabled={!file}
                      >
                        Upload Image
                      </Button>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-select for locations */}
            <div className="space-y-2">
              <Label>Available Locations *</Label>
              <LocationMultiSelect
                selectedLocations={selectedLocations}
                setSelectedLocations={setSelectedLocations}
                locations={locations}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newItem.is_available}
                onCheckedChange={(checked) => setNewItem({ ...newItem, is_available: checked })}
              />
              <Label>Available for ordering</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                {editingItem ? "Update Item" : "Add Item"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Menu Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (selectedLocations.length === 0) {
                  alert("Please select at least one location.")
                  return
                }
                await handleSubmit(e)
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Item Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select
                    value={editingItem.category_id}
                    onValueChange={(categoryId) => setEditingItem({ ...editingItem, category_id: categoryId })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((cat) => cat.id !== "all")
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image</Label>
                  <div className="flex flex-col gap-2 @md:flex-row @md:items-center">
                    <div className="relative flex-shrink-0">
                      <label
                        htmlFor="menu-image-upload"
                        className="cursor-pointer"
                        style={{ display: "flex", alignItems: "center" }}
                        title={editingItem.image_url ? "Click to change image" : "Upload image"}
                      >
                        {file ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Selected"
                            className="w-16 h-16 object-cover rounded border hover:opacity-80 transition"
                            style={{ width: "64px", height: "64px", objectFit: "cover" }}
                          />
                        ) : editingItem.image_url ? (
                          <img
                            src={editingItem.image_url}
                            alt="Menu Item"
                            className="w-16 h-16 object-cover rounded border hover:opacity-80 transition"
                            style={{ width: "64px", height: "64px", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center bg-muted rounded border hover:bg-slate-200 transition">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          id="menu-image-upload"
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setFile(file)
                              if (!file) return
                              const fileExt = file.name.split('.').pop()
                              const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
                              setFileName(fileName)
                            }
                          }}
                        />
                      </label>
                      {(file || editingItem.image_url) && (
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                          style={{ transform: "translate(40%, -40%)" }}
                          onClick={() => {
                            setFile(null)
                            setFileName("")
                            setEditingItem({ ...editingItem, image_url: "" })
                          }}
                          aria-label="Remove image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <Input
                        id="image_url"
                        value={editingItem.image_url}
                        onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                        placeholder="Paste image URL"
                        className="w-full"
                        style={{ width: "150px" }}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={async () => {
                            if (!file) {
                              alert("Please select an image file first.")
                              return
                            }
                            const { data, error } = await supabase.storage
                              .from("menu-items")
                              .upload(fileName, file, { upsert: true })
                            if (error) {
                              alert("Image upload failed")
                              return
                            }
                            const { data: publicUrlData } = supabase.storage
                              .from("menu-items")
                              .getPublicUrl(fileName)
                            setEditingItem({ ...editingItem, image_url: publicUrlData.publicUrl })
                          }
                          }
                          disabled={!file}
                        >
                          Upload Image
                        </Button>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Available Locations *</Label>
                <LocationMultiSelect
                  selectedLocations={
                    editingItem.menu_item_locations
                      ? editingItem.menu_item_locations.map((loc: any) => loc.location_id)
                      : []
                  }
                  setSelectedLocations={(locs) => {
                    setEditingItem({
                      ...editingItem,
                      menu_item_locations: locs.map((location_id) => ({
                        ...(editingItem.menu_item_locations?.find((l: any) => l.location_id === location_id) || {}),
                        location_id,
                      })),
                    })
                    setSelectedLocations(locs)
                  }}
                  locations={locations}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingItem.menu_item_locations[0].is_available}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_available: checked })}
                />
                <Label>Available for ordering</Label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Update Item
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>

  )

}

// Simple LocationMultiSelect component definition
type LocationMultiSelectProps = {
  selectedLocations: string[]
  setSelectedLocations: (locations: string[]) => void
  locations: { id: string; name: string }[]
}

function LocationMultiSelect({
  selectedLocations,
  setSelectedLocations,
  locations
}: LocationMultiSelectProps) {
  const allSelected = locations.length > 0 && selectedLocations.length === locations.length

  const handleToggle = (id: string) => {
    if (selectedLocations.includes(id)) {
      setSelectedLocations(selectedLocations.filter((loc) => loc !== id))
    } else {
      setSelectedLocations([...selectedLocations, id])
    }
  }

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedLocations([])
    } else {
      setSelectedLocations(locations.map((loc) => loc.id))
    }
  }
  console.log("locations: ", locations)
  return (
    <div>
      <div className="w-full">
        <div className="relative">
          <Button
            asChild
            variant="outline"
            className="w-full justify-between"
            type="button"
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex justify-between items-center">
                {selectedLocations.length === 0
                  ? "Select locations"
                  : allSelected
                    ? "All locations selected"
                    : `${selectedLocations.length} selected`}
                <ChevronDown className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-2">
                <div className="flex items-center mb-2">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    id="select-all"
                  />
                  <label
                    htmlFor="select-all"
                    className="ml-2 text-sm cursor-pointer select-none"
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </label>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {locations.map((loc) => (
                    <div key={loc.id} className="flex items-center px-1 py-1 rounded hover:bg-muted">
                      <Checkbox
                        checked={selectedLocations.includes(loc.id)}
                        onCheckedChange={() => handleToggle(loc.id)}
                        id={`loc-${loc.id}`}
                      />
                      <label
                        htmlFor={`loc-${loc.id}`}
                        className="ml-2 text-sm cursor-pointer select-none flex-1"
                      >
                        {loc.name}
                      </label>
                      {selectedLocations.includes(loc.id) && (
                        <Check className="w-4 h-4 text-emerald-600 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
                {selectedLocations.length === 0 && (
                  <div className="text-xs text-red-500 mt-2">Please select at least one location.</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>
        </div>
      </div>
    </div>
  )
}
