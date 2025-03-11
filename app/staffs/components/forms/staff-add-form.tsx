'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useMutation, useQuery } from '@apollo/client';
import {  STAFF_REGISTER_V2 } from '@/graphql/accounts';
import { useToast } from '@/hooks/use-toast';
import { OPTION_TYPE, SwitchItem, TextField } from '@/components/input';
import PasswordField from '@/components/input/password-field';
import { Button } from '@/components/button';
import { ROLES_QUERY, USER_QUERY } from '@/graphql/accounts/queries';
import { Loading } from '@/components/ui';

const formSchema = z.object({
    email: z.string().email().toLowerCase().min(5, {
        message: 'Email must be valid',
    }),
    password: z.string().min(2, {
        message: 'password must be at least 5 characters.',
    }),
    name: z.string().min(2, {
        message: 'name must be at least 5 characters.',
    }),
    phone: z.string().min(9, {
        message: 'phone must be at least 9 characters.',
    }),
    gender: z.string().optional(),
    role: z.string(),
});

function StaffAddForm() {
    const { toast } = useToast();
    const router = useRouter();

    const params = useSearchParams();
    const staffId = params.get('staffId');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: 'pass123',
        },
    });

    useQuery(USER_QUERY, {
        variables: {
            id: staffId,
        },
        skip: !staffId,
        onCompleted(data) {
            if (data?.user?.name) {
                form.setValue('name', data?.user?.name);
            }
            if (data?.user?.email) {
                form.setValue('email', data?.user?.email);
            }
            if (data?.user?.phone) {
                form.setValue('phone', data?.user?.phone);
            }
            if (data?.user?.gender) {
                form.setValue('gender', data?.user?.gender);
            }
            if (data?.user?.role) {
                form.setValue('role', data?.user?.role.id);
            }
            
            form.setValue('password', '');
        },
    });

    const { data, loading: roleQueryLoading } = useQuery(ROLES_QUERY);

    let roles = data?.roles?.map((role: { name: string; id: string }) => ({
        label: role.name,
        value: role.id,
    }))

    roles = roles?.filter(
        (role: OPTION_TYPE) => role.label !== 'CUSTOMER'
    );

    

    const [registerUser, { loading }] = useMutation(STAFF_REGISTER_V2, {
        onCompleted: async () => {
            toast({
                variant: 'default',
                description: 'Staff successfully created!',
            });
            router.push('/staffs');
        },
        onError: (err) => {
            console.log(err);
            toast({
                variant: 'destructive',
                description: err.message,
            });
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        registerUser({
            variables: {
                input: {
                    id:staffId,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: data.role,
                    gender: data.gender,
                    password: data.password,
                },
            },
        });
    }

    if (roleQueryLoading) return <Loading />;

    return (
        <div>
            <CardHeader>
                <CardTitle className="text-2xl">Create New Staff</CardTitle>
                <CardDescription>
                    Enter your information below to create to new account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className=" flex flex-col gap-5"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                form={form}
                                name="name"
                                label="Name"
                                placeholder="Name"
                            />
                            <TextField
                                form={form}
                                name="email"
                                label="Email"
                                placeholder="Email"
                            />
                            <SwitchItem
                                form={form}
                                name="role"
                                label="Role"
                                placeholder="Role"
                                options={roles}
                            />
                            <SwitchItem
                                form={form}
                                name="gender"
                                label="Gender"
                                placeholder="Gender"
                                options={[
                                    { value: 'MALE', label: 'Male' },
                                    { value: 'FEMALE', label: 'FEMALE' },
                                    { value: 'OTHER', label: 'OTHER' },
                                ]}
                            />

                            <TextField
                                form={form}
                                name="phone"
                                label="Phone"
                                placeholder="Phone"
                            />
                            <PasswordField
                                form={form}
                                name="password"
                                label="Password"
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <Button className="w-[150px]" isLoading={loading}>
                                Register
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </div>
    );
}

export default StaffAddForm;
