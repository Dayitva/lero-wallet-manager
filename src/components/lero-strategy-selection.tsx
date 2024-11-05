"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowRight, ShieldCheck, Scale, Zap } from "lucide-react"
import { useRouter } from 'next/navigation';

type Strategy = "conservative" | "balanced" | "degen"

const strategies = [
  {
    id: "conservative",
    name: "Conservative",
    description: "Low risk, stable returns",
    icon: ShieldCheck,
    expectedYield: "2-4%",
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "Moderate risk, balanced returns",
    icon: Scale,
    expectedYield: "4-6%",
  },
  {
    id: "degen",
    name: "Degen",
    description: "High risk, potential high returns",
    icon: Zap,
    expectedYield: "6-8%",
  },
]

export function LeroStrategySelectionComponent() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [createWalletLoading, setCreateWalletLoading] = useState(false);
  const [createWalletError, setCreateWalletError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateAgent = async () => {
    setCreateWalletLoading(true);
    setCreateWalletError(null);

    if (selectedStrategy) {
      try {
        const networkId = 'base-mainnet';
        const response = await fetch('/api/wallets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ networkId }),
        });
  
        if (!response.ok) throw new Error('Failed to create wallet');
  
        const data = await response.json();
        router.push(`/wallets/${data.id}`);
      } catch (err) {
        setCreateWalletError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setCreateWalletLoading(false);
      }

      console.log(`Creating agent for ${selectedStrategy} strategy`)
    }

  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Select Your Lero Strategy</h1>
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Risk Profile</CardTitle>
          <CardDescription>Select the strategy that best fits your investment goals</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedStrategy || ""} onValueChange={(value: Strategy) => setSelectedStrategy(value)}>
            <div className="grid gap-6 md:grid-cols-3">
              {strategies.map((strategy) => (
                <div key={strategy.id}>
                  <RadioGroupItem
                    value={strategy.id}
                    id={strategy.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={strategy.id}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <strategy.icon className="mb-3 h-6 w-6" />
                    <h3 className="font-semibold">{strategy.name}</h3>
                    <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    <p className="mt-2 font-medium">Expected Yield: {strategy.expectedYield}</p>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleCreateAgent}
            disabled={!selectedStrategy && createWalletLoading}
            className="mt-4"
          >
            Create Agent <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      {createWalletError && <p className="text-red-500 dark:text-red-400 mt-4 text-sm">{createWalletError}</p>}
    </div>
  )
}