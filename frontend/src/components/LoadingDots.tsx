import { Box } from '@mui/material';

interface LoadingDotsProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'medium',
}) => {
  const dotSizes = {
    small: 4,
    medium: 6,
    large: 8,
  };

  const dotSize = dotSizes[size];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: 'text.secondary',
            animation: 'loadingDots 1.4s infinite both',
            animationDelay: `${index * 0.16}s`,
            '@keyframes loadingDots': {
              '0%, 80%, 100%': {
                transform: 'scale(0)',
                opacity: 0.5,
              },
              '40%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        />
      ))}
    </Box>
  );
};
