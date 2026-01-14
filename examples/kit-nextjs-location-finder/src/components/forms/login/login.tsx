'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Text, Field } from '@sitecore-content-sdk/nextjs';
import { SuccessCompact } from '../success/success-compact.dev';
import { EnumValues } from '@/enumerations/generic.enum';
import { ButtonVariants } from '@/enumerations/ButtonStyle.enum';

interface LoginFormProps {
  fields?: {
    emailLabel?: Field<string>;
    emailPlaceholder?: Field<string>;
    emailErrorMessage?: Field<string>;
    buttonText?: Field<string>;
    successMessage?: Field<string>;
    buttonVariant?: EnumValues<typeof ButtonVariants>;
  };
  className?: string;
}

const formSchema = z.object({
  email: z
    .string()
    .nonempty({
      message: 'Email is required',
    })
    .email({
      message: 'Please enter a valid email address',
    }),
});

const updateSchemaWithDictionary = (fields: LoginFormProps['fields']) => {
  return formSchema.extend({
    // Update the schema with the dictionary values here
    email: z.string().email({
      message: fields?.emailErrorMessage?.value || 'Please enter a valid email address',
    }),
  });
};

export const Default: React.FC<LoginFormProps> = (props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const schemaWithDiction = updateSchemaWithDictionary(props.fields);
  const form = useForm<z.infer<typeof schemaWithDiction>>({
    resolver: zodResolver(schemaWithDiction),
    defaultValues: {
      email: '',
    },
  });

  // arg - values: z.infer<typeof formSchema>
  function onSubmit() {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  }

  // Data assignments
  const emailLabel = props.fields?.emailLabel?.value || 'Email';
  const emailPlaceholder = props.fields?.emailPlaceholder?.value || 'Enter your email address';
  const buttonText = props.fields?.buttonText?.value || 'Finish Booking';
  const successMessage =
    props.fields?.successMessage?.value || 'Got it. Thank you! We will be in touch shortly.';
  const btnVariant = props.fields?.buttonVariant || 'default';

  if (isSubmitted) {
    return <SuccessCompact successMessage={successMessage} />;
  }

  // Repeated classes
  const formItemClasses = 'relative space-y-2';
  const labelClasses = 'block text-foreground text-left';
  const inputClasses = 'rounded-md px-2 py-3 border-foreground bg-background text-foreground';
  const errorClasses = 'absolute -translate-y-[5px] text-[#ff5252]';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[750px] space-y-9 group-[.position-center]:mx-auto group-[.position-right]:ml-auto"
      >
    
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className={formItemClasses}>
              <FormLabel className={labelClasses}>{emailLabel}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={emailPlaceholder}
                  className={inputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage className={errorClasses} />
            </FormItem>
          )}
        />
        <div>
          <Button className="mt-4" type="submit" variant={btnVariant}>
            <Text field={{ value: buttonText }} />
          </Button>
        </div>
      </form>
    </Form>
  );
};

