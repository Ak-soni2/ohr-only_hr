import React, { useState } from 'react';
import { Check, Star, Crown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const membershipSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  qualification: z.string(),
  expertise: z.string(),
  address: z.string(),
  city: z.string(),
  pincode: z.string(),
  state: z.string(),
  dob: z.string(),
  employer: z.string(),
  designation: z.string(),
  officialEmail: z.string().email(),
  officeAddress: z.string(),
  officeCity: z.string(),
  officePincode: z.string(),
  officeState: z.string(),
  officePhone: z.string(),
  facebook: z.string(),
  linkedin: z.string(),
  contribution: z.string(),
});

export const MembershipPlans: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      fullName: '', email: '', phone: '', qualification: '', expertise: '', address: '', city: '',
      pincode: '', state: '', dob: '', employer: '', designation: '', officialEmail: '', officeAddress: '',
      officeCity: '', officePincode: '', officeState: '', officePhone: '', facebook: '', linkedin: '', contribution: ''
    },
  });

  const yearlyFeatures = [
    'Access to all monthly events',
    'Networking opportunities',
    'Resource library access',
    'Monthly newsletters',
    'Community forum access',
    'Event recordings',
    'Certificate of participation',
  ];

  const lifetimeFeatures = [
    'All yearly plan benefits',
    'Priority event registration',
    'Exclusive member events',
    'One-on-one mentorship sessions',
    'Career development workshops',
    'Direct access to speakers',
    'Lifetime community access',
    'Guest lecture opportunities',
    'CSR activity participation',
    'Annual gala dinner invitation',
  ];

  const renderForm = () => (
    <Form {...form}>
      <form className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto" onSubmit={form.handleSubmit(console.log)}>
        {Object.entries(form.getValues()).map(([key], i) => (
          <FormField key={i} control={form.control} name={key} render={({ field }) => (
            <FormItem>
              <FormLabel>{key.replace(/([A-Z])/g, ' $1')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={key} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        ))}
        <Button type="submit">Pay & Proceed</Button>
      </form>
    </Form>
  );

  const PlanCard = ({ title, price, duration, features, icon, isPopular }: any) => (
    <div className={`relative rounded-3xl p-8 shadow-xl ${title === 'Lifetime Pass' ? 'bg-secondary text-white' : 'bg-card text-card-foreground'} hover:shadow-2xl transition-shadow duration-300`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 ${title === 'Lifetime Pass' ? 'bg-white/20' : 'bg-gradient-to-r from-blue-500 to-blue-600'} rounded-full mb-4`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{duration}</p>
        <div className="text-4xl font-bold mb-2">{price}</div>
        <p className="text-muted-foreground">{title === 'Lifetime Pass' ? 'one-time payment' : 'per year'}</p>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center space-x-3">
            <Check size={20} className="text-green-500 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="w-full bg-white text-primary py-4 px-6 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Choose {title}
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Membership Registration</DialogTitle>
            <DialogDescription>
              Fill the details below and proceed to payment
            </DialogDescription>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
            Membership Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan to accelerate your HR career and connect with like-minded professionals.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PlanCard title="Yearly Pass" price="$299" duration="Perfect for growing professionals" features={yearlyFeatures} icon={<Star size={32} className="text-white" />} />
          <PlanCard title="Lifetime Pass" price="$899" duration="For serious HR professionals" features={lifetimeFeatures} icon={<Crown size={32} className="text-white" />} isPopular />
        </div>
      </div>
    </section>
  );
};
