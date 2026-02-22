import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, TrendingUp, BarChart3, Shield, Lock, CheckCircle2, Zap, Megaphone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProfitData {
  level: string;
  totalDeposit: number;
  totalProfit: number;
  perUserProfit: number;
}

interface ComparisonData {
  system: string;
  profit: number;
  color: string;
}

export default function CalcPage() {
  const [users, setUsers] = useState('100');
  const [depositAmount, setDepositAmount] = useState('1000');
  const [profitPercent, setProfitPercent] = useState('10');
  const [levels, setLevels] = useState('6');
  const [increment, setIncrement] = useState('5');

  const [comparisonUsers, setComparisonUsers] = useState('50');
  const [comparisonDeposit, setComparisonDeposit] = useState('5000');

  const calculateProfitScenario = (): ProfitData[] => {
    const numUsers = Number(users);
    const deposit = Number(depositAmount);
    const profit = Number(profitPercent) / 100;
    const numLevels = Number(levels);

    const data: ProfitData[] = [];
    for (let level = 1; level <= numLevels; level++) {
      const totalDeposit = deposit * numUsers * level;
      const totalProfit = totalDeposit * profit;
      const perUserProfit = totalProfit / numUsers;

      data.push({
        level: `Level ${level}`,
        totalDeposit,
        totalProfit,
        perUserProfit,
      });
    }
    return data;
  };

  const calculateComparison = (): ComparisonData[] => {
    const numUsers = Number(comparisonUsers);
    const deposit = Number(comparisonDeposit);

    const secoinfiProfit = deposit * 0.15 * numUsers;
    const govtChitProfit = deposit * 0.08 * numUsers;
    const pvtChitProfit = deposit * 0.12 * numUsers;

    return [
      { system: 'Secoinfi', profit: secoinfiProfit, color: '#8b5cf6' },
      { system: 'Govt Chit', profit: govtChitProfit, color: '#3b82f6' },
      { system: 'Pvt Chit', profit: pvtChitProfit, color: '#10b981' },
    ];
  };

  const profitData = calculateProfitScenario();
  const comparisonData = calculateComparison();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img src="/assets/generated/profit-calculator.dim_500x350.png" alt="Calculator" className="h-32 w-auto rounded-lg shadow-lg" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Profit Calculator</h1>
        <p className="text-muted-foreground">Calculate potential earnings and compare with traditional systems</p>
      </div>

      <Tabs defaultValue="scenario" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scenario" className="flex items-center">
            <Calculator className="mr-2 h-4 w-4" />
            Profit Scenario
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            System Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scenario" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Level Profit Calculator</CardTitle>
              <CardDescription>Calculate potential earnings across multiple transaction levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="users">Number of Users</Label>
                  <Input
                    id="users"
                    type="number"
                    value={users}
                    onChange={(e) => setUsers(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Deposit Amount (₹)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profit">Profit %</Label>
                  <Input
                    id="profit"
                    type="number"
                    value={profitPercent}
                    onChange={(e) => setProfitPercent(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="levels">Number of Levels</Label>
                  <Input
                    id="levels"
                    type="number"
                    value={levels}
                    onChange={(e) => setLevels(e.target.value)}
                    min="1"
                    max="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="increment">Increment %</Label>
                  <Input
                    id="increment"
                    type="number"
                    value={increment}
                    onChange={(e) => setIncrement(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="totalDeposit" stroke="#8b5cf6" name="Total Deposit" strokeWidth={2} />
                    <Line type="monotone" dataKey="totalProfit" stroke="#10b981" name="Total Profit" strokeWidth={2} />
                    <Line type="monotone" dataKey="perUserProfit" stroke="#f59e0b" name="Per User Profit" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-primary/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₹{profitData.length > 0 ? profitData[profitData.length - 1].totalDeposit.toLocaleString() : '0'}</p>
                  </CardContent>
                </Card>
                <Card className="border-green-500/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">₹{profitData.length > 0 ? profitData[profitData.length - 1].totalProfit.toLocaleString() : '0'}</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-500/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Per User Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-amber-600">₹{profitData.length > 0 ? profitData[profitData.length - 1].perUserProfit.toLocaleString() : '0'}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Promotional Banner */}
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 via-chart-1/10 to-chart-2/10 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Megaphone className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    Bridge the Digital Economic Divide with SECOINFI
                  </h3>
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                    <p className="text-base md:text-lg leading-relaxed">
                      <strong className="text-primary">Hi,</strong> 3 Billion Out of 8 Billion Global Users are YT Subscribers, But Earn Nothing. 
                      So to Bridge Digital, Economic Divide. We at <strong className="text-primary">#SECOINFI</strong>, Offer Lifetime Income to ALL Subscribers 
                      as Our Network of <strong>109000 Users</strong>. Earn Early Bird Benefits by Subscribing to <strong className="text-primary">#SECOINFI</strong> with 
                      Subscription Amount sent to Our UPI ID <strong className="font-mono bg-primary/20 px-2 py-1 rounded">secoin@uboi</strong> to get 
                      Unlimited Returns than Bank FDs.
                    </p>
                    <p className="text-base md:text-lg leading-relaxed">
                      So Members must Bid before Monday with <strong className="text-chart-3">Min. Amount of Rs.10 Only</strong> in multiples of 10, 
                      To Get Loans at <strong className="text-chart-3">0% Interest with NO Docs</strong>, Prefer Staking in ICP / e-Gold / SECOIN, etc.
                    </p>
                    <p className="text-base md:text-lg leading-relaxed">
                      Pl. Visit{' '}
                      <a 
                        href="https://sec-epay-am0.caffeine.xyz/calc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                      >
                        https://sec-epay-am0.caffeine.xyz/calc
                      </a>{' '}
                      for Millions of Immutable, Trust-less, Global Txns. Refer gPay at{' '}
                      <a 
                        href="https://g.co/payinvite/Cq9dl" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                      >
                        https://g.co/payinvite/Cq9dl
                      </a>{' '}
                      <strong className="text-primary">#NaMoHind</strong>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                      Early Bird Benefits
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-chart-3 text-white">
                      0% Interest Loans
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-chart-1 text-white">
                      109K+ Users
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-chart-2 text-white">
                      Min. Rs.10 Only
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Choose Secoinfi Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                Why Choose Secoinfi?
              </CardTitle>
              <CardDescription>Discover the advantages of our blockchain-based financial platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-primary" />
                      Transparency & Trust
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Blockchain-based verification ensures every transaction is transparent and traceable. 
                      No hidden fees, no surprises—just complete visibility into your financial operations.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-chart-2/30 bg-gradient-to-br from-chart-2/5 to-transparent">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Lock className="mr-2 h-5 w-5 text-chart-2" />
                      Merkle-Root Traceability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Complete audit trails with Merkle root generation for transaction blocks. 
                      Every transaction is cryptographically secured and permanently recorded for verification.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-chart-3/30 bg-gradient-to-br from-chart-3/5 to-transparent">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-chart-3" />
                      Protection from Fraud
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Automated validation and real-time verification protect you from fake e-chit operators. 
                      Our system ensures only legitimate transactions are processed.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-chart-4/30 bg-gradient-to-br from-chart-4/5 to-transparent">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-chart-4" />
                      Automation & Decentralization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Automated transaction processing eliminates manual errors and delays. 
                      Decentralized operations ensure no single point of failure or control.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 rounded-lg p-6">
                <h4 className="font-semibold text-lg mb-3">Financial Inclusivity & Accessibility</h4>
                <p className="text-muted-foreground mb-4">
                  Secoinfi is built on the principles of trust, automation, and decentralization to provide 
                  secure and reliable financial services for everyone. Our platform democratizes access to 
                  financial tools traditionally available only to large institutions.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">✓</span>
                    <span>Multi-level transaction processing with unlimited depth</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">✓</span>
                    <span>Real-time grand total validation per transaction batch</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">✓</span>
                    <span>Automatic running balance calculations that match transaction history</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">✓</span>
                    <span>Higher returns compared to traditional chit fund systems</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Comparison</CardTitle>
              <CardDescription>Compare Secoinfi with traditional chit fund systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="compUsers">Number of Users</Label>
                  <Input
                    id="compUsers"
                    type="number"
                    value={comparisonUsers}
                    onChange={(e) => setComparisonUsers(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compDeposit">Deposit Amount (₹)</Label>
                  <Input
                    id="compDeposit"
                    type="number"
                    value={comparisonDeposit}
                    onChange={(e) => setComparisonDeposit(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="system" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="profit" fill="#8b5cf6" name="Total Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {comparisonData.map((item) => (
                  <Card key={item.system} className="border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{item.system}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold" style={{ color: item.color }}>
                        ₹{item.profit.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.system === 'Secoinfi' ? '15% returns' : item.system === 'Govt Chit' ? '8% returns' : '12% returns'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                    Secoinfi System Comparison
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <img 
                      src="/assets/Sec-ePay.png" 
                      alt="Secoinfi System Comparison" 
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-muted-foreground">
                      The Secoinfi System Comparison illustrates the advantages of our blockchain-based financial platform. 
                      The comparison chart shows how user payer deposits, running totals, and sorted pay-outs are managed transparently. 
                      With a conversion rate of <strong>1 USD = 90 INR</strong>, Secoinfi offers competitive rates and secure transactions.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Promotional Banner in System Comparison Tab */}
                <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 via-chart-1/10 to-chart-2/10 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Megaphone className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                          Bridge the Digital Economic Divide with SECOINFI
                        </h3>
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                          <p className="text-base md:text-lg leading-relaxed">
                            <strong className="text-primary">Hi,</strong> 3 Billion Out of 8 Billion Global Users are YT Subscribers, But Earn Nothing. 
                            So to Bridge Digital, Economic Divide. We at <strong className="text-primary">#SECOINFI</strong>, Offer Lifetime Income to ALL Subscribers 
                            as Our Network of <strong>109000 Users</strong>. Earn Early Bird Benefits by Subscribing to <strong className="text-primary">#SECOINFI</strong> with 
                            Subscription Amount sent to Our UPI ID <strong className="font-mono bg-primary/20 px-2 py-1 rounded">secoin@uboi</strong> to get 
                            Unlimited Returns than Bank FDs by Sending the Txn ID / Receipt to{' '}
                            <a 
                              href="https://wa.me/919620058644" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                            >
                              https://wa.me/919620058644
                            </a>{' '}
                            /{' '}
                            <a 
                              href="mailto:dild26@icloud.com" 
                              className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                            >
                              emailto:dild26@icloud.com
                            </a>.
                          </p>
                          <p className="text-base md:text-lg leading-relaxed">
                            So Members must Bid before Monday with <strong className="text-chart-3">Min. Amount of Rs.10 Only</strong> in multiples of 10, 
                            To Get Loans at <strong className="text-chart-3">0% Interest with NO Docs</strong>, Prefer Staking in ICP / e-Gold / SECOIN, etc.
                          </p>
                          <p className="text-base md:text-lg leading-relaxed">
                            Pl. Visit{' '}
                            <a 
                              href="https://sec-epay-am0.caffeine.xyz/calc" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                            >
                              https://sec-epay-am0.caffeine.xyz/calc
                            </a>{' '}
                            for Millions of Immutable, Trust-less, Global Txns. Refer gPay at{' '}
                            <a 
                              href="https://g.co/payinvite/Cq9dl" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                            >
                              https://g.co/payinvite/Cq9dl
                            </a>{' '}
                            <strong className="text-primary">#NaMoHind</strong>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                            Early Bird Benefits
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-chart-3 text-white">
                            0% Interest Loans
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-chart-1 text-white">
                            109K+ Users
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-chart-2 text-white">
                            Min. Rs.10 Only
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                    Why Choose Secoinfi?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center">
                          <Shield className="mr-2 h-5 w-5 text-primary" />
                          Transparency & Trust
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Blockchain-based verification ensures every transaction is transparent and traceable. 
                          No hidden fees, no surprises—just complete visibility into your financial operations.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-chart-2/30 bg-gradient-to-br from-chart-2/5 to-transparent">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center">
                          <Lock className="mr-2 h-5 w-5 text-chart-2" />
                          Merkle-Root Traceability
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Complete audit trails with Merkle root generation for transaction blocks. 
                          Every transaction is cryptographically secured and permanently recorded for verification.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-chart-3/30 bg-gradient-to-br from-chart-3/5 to-transparent">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center">
                          <CheckCircle2 className="mr-2 h-5 w-5 text-chart-3" />
                          Protection from Fraud
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Automated validation and real-time verification protect you from fake e-chit operators. 
                          Our system ensures only legitimate transactions are processed.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-chart-4/30 bg-gradient-to-br from-chart-4/5 to-transparent">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center">
                          <Zap className="mr-2 h-5 w-5 text-chart-4" />
                          Automation & Decentralization
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Automated transaction processing eliminates manual errors and delays. 
                          Decentralized operations ensure no single point of failure or control.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 rounded-lg p-6">
                  <h4 className="font-semibold text-lg mb-3">Financial Inclusivity & Accessibility</h4>
                  <p className="text-muted-foreground mb-4">
                    Secoinfi is built on the principles of trust, automation, and decentralization to provide 
                    secure and reliable financial services for everyone. Our platform democratizes access to 
                    financial tools traditionally available only to large institutions.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">✓</span>
                      <span>Multi-level transaction processing with unlimited depth</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">✓</span>
                      <span>Real-time grand total validation per transaction batch</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">✓</span>
                      <span>Automatic running balance calculations that match transaction history</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">✓</span>
                      <span>Higher returns compared to traditional chit fund systems</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
