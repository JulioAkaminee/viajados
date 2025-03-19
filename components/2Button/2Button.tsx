
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import styles from "./styles"

type Variant = 'primary' | 'secondary';

type Props = TouchableOpacityProps & {
  label: string;
  variant?: Variant;
};

function Buttoon({ label, variant = 'primary', ...rest }: Props) {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    
  };

  const textStyles = {
    primary: styles.labelPrimary,
    secondary: styles.labelSecondary,
 
  };

  return (
    <TouchableOpacity
      style={[styles.button, variantStyles[variant]]}
      {...rest}
    >
      <Text style={[styles.label, textStyles[variant]]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default Buttoon;