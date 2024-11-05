"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

// Mock data for demonstration
const mockTransactions = [
  { id: 1, protocol: "Renzo", amount: 0.048, timestamp: "2024-11-05T02:20:43Z", type: "invest" },
  { id: 2, protocol: "KelpDAO", amount: 0.096, timestamp: "2024-11-05T02:20:47Z", type: "invest" },
  { id: 3, protocol: "Etherfi", amount: 0.072, timestamp: "2024-11-05T02:20:51Z", type: "invest" },
]

export function LeroDashboardComponent() {
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false)
  const [investAmount, setInvestAmount] = useState("")
  const [transactions, setTransactions] = useState([])

  // const totalInvested = transactions.reduce((sum, tx) => sum + (tx.type === "invest" ? tx.value : -tx.value), 0)
  const totalInvested = 0.216;
  const currentValue = totalInvested * 1 // Assuming 15% growth for demonstration

  useEffect(() => {
    const protocol_dict: { [key: string]: string } = {
      "0xf25484650484DE3d554fB0b7125e7696efA4ab99": "Renzo",
      "0xc38e046dFDAdf15f7F56853674242888301208a5": "Etherfi",
      "0x291088312150482826b3A37d5A69a4c54DAa9118": "KelpDAO"
    }

    async function fetchTransactions() {
      try {
        const response = await fetch('/api/dashboard?walletId=3eca4f71-862f-46e1-9f36-cd9466a25287', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        
        if (!data.transactions) {
          throw new Error('Transactions data is missing');
        }

        interface Transaction {
          toAddressId: string;
          value: number;
          timestamp: string;
        }

        const transactionDetails = data.transactions.map((transaction: Transaction) => ({
          protocol: protocol_dict[transaction.toAddressId], 
          amount: transaction.value,
          timestamp: transaction.timestamp, 
          type: transaction.toAddressId ? "invest" : "divest"
        }));
        setTransactions(transactionDetails);
        console.log('Transactions fetched:', transactionDetails);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }

    fetchTransactions();
  }, [])

  // const handleInvest = () => {
  //   // Here you would implement the logic to process the new investment
  //   console.log(`Investing additional ${investAmount}`)
  //   setIsInvestDialogOpen(false)
  //   setInvestAmount("")
  //   // In a real application, this would likely involve a call to your backend API
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lero AI Agent Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${totalInvested.toLocaleString()}</p>
            <p className="text-2xl font-bold">(0.0009E)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${currentValue.toLocaleString()}</p>
            <p className="text-sm text-green-600 flex items-center mt-2">
              <ArrowUpRight className="mr-1" />
              {((currentValue / totalInvested - 1) * 100).toFixed(2)}% growth
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          {/* <CardDescription>AI agent investment activities</CardDescription> */}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocol</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.protocol}</TableCell>
                  <TableCell>${tx.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {tx.type === "invest" ? (
                      <span className="text-green-600 flex items-center">
                        <ArrowUpRight className="mr-1" /> Invest
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <ArrowDownRight className="mr-1" /> Divest
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
        <DialogTrigger asChild>
          <Button size="lg">Invest More</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest More</DialogTitle>
            <DialogDescription>Enter the amount you want to invest</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                className="col-span-3"
                placeholder="Enter amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInvest} disabled={!investAmount}>Confirm Investment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}