import ReCAPTCHA from 'react-google-recaptcha';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { FieldErrors } from 'react-hook-form';

export type ReCaptchaFieldHandle = {
  reset: () => void;
};

interface ReCaptchaFieldProps {
  name?: string;
  className?: string;
  setValue: (name: string, value: string) => void;
  trigger: (name: string) => Promise<boolean>;
  errors: FieldErrors;
}

const ReCaptchaField = forwardRef<ReCaptchaFieldHandle, ReCaptchaFieldProps>(
  ({ name = 'recaptcha', className, setValue, trigger, errors }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        recaptchaRef.current?.reset();
        setValue(name, '');
      },
    }));

    const handleRecaptchaChange = (token: string | null) => {
      setValue(name, token ?? '');
      trigger(name);
    };

    return (
      <div>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={handleRecaptchaChange}
          className={className}
        />
        
      </div>
    );
  }
);

export default ReCaptchaField;