import Container from "@/components/ui/Container";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  phone: z.string().min(8, {
    message: "Phone number must be at least 8 digits.",
  }),
  email: z.string().email().min(5, {
    message: "Invalid email",
  }),
  adultsCount: z.coerce.number().min(1, {
    message: "Min number should be 1.",
  }),
  kidsCount: z.coerce.number().min(0, {
    message: "Min number should be 0",
  }),
});

export const RegisterForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });
  const onSubmit = async (values: any) => {
    // async request which may result error
    try {
      // await fetch()
      console.log("submit", values);
      setOpenDialog(false);
    } catch (e) {
      // handle your error
    }
  };

  return (
    <Container>
      <div className="my-10">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="mt-2" variant="default">
              Register here !
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] h-full max-h-[96%] p-4">
            <ScrollArea className="p-4">
              <DialogHeader className="mb-5 gap-2">
                <DialogTitle>Register for the conference</DialogTitle>
                <DialogDescription>
                  Fill up <b>Basic Info</b> & <b>Additional Info</b>. Click
                  submit when you're done.
                </DialogDescription>
              </DialogHeader>
              <Tabs className="flex flex-col gap-8" defaultValue="basic-info">
                <TabsList>
                  <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                  <TabsTrigger value="additional">Additional Info</TabsTrigger>
                </TabsList>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <TabsContent defaultChecked value="basic-info">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Name" {...field} />
                            </FormControl>
                            <FormDescription>Your full name.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="145 Victoria Parade, Fitzroy VIC 3065, Australia"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Melbourne" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="VIC" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="61 4 1234 5678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="example@gmail.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="additional">
                      <FormField
                        control={form.control}
                        name="adultsCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              No.of people attending(adults)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Total no.of adults"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="kidsCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>No.of people attending(kids)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Total no.of kids"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className="mt-8" type="submit">
                        Submit
                      </Button>
                    </TabsContent>
                  </form>
                </Form>
                <DialogFooter>
                  {/* <Button type="submit">Save changes</Button> */}
                </DialogFooter>
              </Tabs>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
};
