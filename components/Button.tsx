import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet } from "react-native";


type Props = TouchableOpacityProps & {
  label: String;
};

function Button({ label, ...rest }: Props) {
  return (
    <TouchableOpacity style={styles.button} {...rest}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#D6005D'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#FFF'
    
  },
});

export default Button;