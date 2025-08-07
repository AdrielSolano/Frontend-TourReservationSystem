// src/components/DialogMotionTransition.jsx
import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const variants = {
  initial: { opacity: 0, scale: 0.96, y: 8, filter: 'blur(2px)' },
  animate: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' },
  exit:    { opacity: 0, scale: 0.96, y: -8, filter: 'blur(2px)' },
};

// Componente para usar en Dialog. MUI necesita un forwardRef aquí.
const DialogMotionTransition = forwardRef(function DialogMotionTransition(props, ref) {
  const { children, ...rest } = props;
  return (
    <MotionDiv
      ref={ref}
      {...rest}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ display: 'inline-block', width: '100%' }}
    >
      {children}
    </MotionDiv>
  );
});

export default DialogMotionTransition;
