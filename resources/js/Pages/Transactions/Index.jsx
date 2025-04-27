import { Button } from "@/components/ui/button";
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

export default function Transactions({ transactions }) {
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Transaction List</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-gray-600 text-sm sm:text-base">
                No transactions yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Facture Number</TableHead>
                      <TableHead className="text-left">Customer</TableHead>
                      <TableHead className="text-left">Transaction Date</TableHead>
                      <TableHead className="text-left">Description</TableHead>
                      <TableHead className="text-left">Evidence</TableHead>
                      <TableHead className="text-left">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-sm sm:text-base">
                          {transaction.facture_number}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">
                          {transaction.customer?.name || 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">
                          {transaction.description || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {transaction.evidence_url ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-5 w-5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-lg">
                                <img
                                  src={transaction.evidence_url}
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
                          {new Date(transaction.created_at).toLocaleDateString()}
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
  );
}