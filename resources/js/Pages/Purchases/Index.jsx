import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye, FileX } from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

export default function Purchases({ purchases, status, auth }) {
  const { data, setData, post, processing, errors } = useForm({
    invoice_number: "",
    distributor: "",
    description: "",
    transaction_date: "",
    evidence: null,
  });

  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData("evidence", file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    post(route("purchases.store"), {
      onSuccess: () => {
        setData({
          invoice_number: "",
          distributor: "",
          description: "",
          transaction_date: "",
          evidence: null,
        });
        setPreview(null);
      },
    });
  };

  return (
    <AppLayout auth={auth}>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Add Purchase</CardTitle>
            </CardHeader>
            <CardContent>
              {status && (
                <div className="mb-4 text-sm text-green-600">{status}</div>
              )}
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoice_number">Invoice Number</Label>
                    <Input
                      id="invoice_number"
                      type="text"
                      value={data.invoice_number}
                      onChange={(e) => setData("invoice_number", e.target.value)}
                      className={`mt-1 ${errors.invoice_number ? "border-red-500" : ""}`}
                    />
                    {errors.invoice_number && (
                      <p className="mt-1 text-sm text-red-600">{errors.invoice_number}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="distributor">Distributor</Label>
                    <Input
                      id="distributor"
                      type="text"
                      value={data.distributor}
                      onChange={(e) => setData("distributor", e.target.value)}
                      className={`mt-1 ${errors.distributor ? "border-red-500" : ""}`}
                    />
                    {errors.distributor && (
                      <p className="mt-1 text-sm text-red-600">{errors.distributor}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    className={`mt-1 ${errors.description ? "border-red-500" : ""}`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="transaction_date">Transaction Date</Label>
                  <Input
                    id="transaction_date"
                    type="date"
                    value={data.transaction_date}
                    onChange={(e) => setData("transaction_date", e.target.value)}
                    className={`mt-1 ${errors.transaction_date ? "border-red-500" : ""}`}
                  />
                  {errors.transaction_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.transaction_date}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="evidence">Evidence (Photo)</Label>
                  <Input
                    id="evidence"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`mt-1 ${errors.evidence ? "border-red-500" : ""}`}
                  />
                  {errors.evidence && (
                    <p className="mt-1 text-sm text-red-600">{errors.evidence}</p>
                  )}
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 h-32 w-auto rounded"
                    />
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full sm:w-auto py-3"
                >
                  Add Purchase
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Purchases Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Purchase List</CardTitle>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <p className="text-gray-600 text-sm sm:text-base">
                  No purchases yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Invoice Number</TableHead>
                        <TableHead className="text-left">Distributor</TableHead>
                        <TableHead className="text-left">Transaction Date</TableHead>
                        <TableHead className="text-left">Description</TableHead>
                        <TableHead className="text-left">Evidence</TableHead>
                        <TableHead className="text-left">Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell className="text-sm sm:text-base">
                            {purchase.invoice_number}
                          </TableCell>
                          <TableCell className="text-sm sm:text-base">
                            {purchase.distributor}
                          </TableCell>
                          <TableCell className="text-sm sm:text-base">
                            {new Date(purchase.transaction_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm sm:text-base">
                            {purchase.description || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {purchase.evidence_url ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-5 w-5" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                  <img
                                    src={purchase.evidence_url}
                                    alt="Evidence"
                                    className="w-full h-auto rounded"
                                  />
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Button variant="ghost" size="icon" disabled>
                                <FileX className="h-5 w-5 text-gray-400" />
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="text-sm sm:text-base">
                            {new Date(purchase.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}