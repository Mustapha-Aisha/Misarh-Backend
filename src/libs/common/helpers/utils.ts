import {
  HttpStatus,
  HttpException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
// import axios from 'axios';

const handleDbErrors = (err) => {
  //foreign key voiation error
  if (err.number === 547) {
    // Handle foreign key violation error here
    throw new BadRequestException('Invalid Foreign Key');
  }
  //duplicate value
  else if (err.number === 2627 || err.number === 2601) {
    throw new BadRequestException('DB duplicate error value already exists');
  }
};

export const handleErrorCatch = (err, source?: string) => {
  handleDbErrors(err);

  if (
    err.status === HttpStatus.NOT_FOUND ||
    err.status === HttpStatus.BAD_REQUEST ||
    err.status === HttpStatus.UNAUTHORIZED ||
    err.status === HttpStatus.FORBIDDEN ||
    err.status === HttpStatus.CONFLICT
  ) {
    throw new HttpException(
      {
        status: err.status,
        error: err.response.message || err.response.error,
      },
      err.status,
    );
  }
}

export const generateVerificationCode = (environment?: string): string => {
  if (environment.toLowerCase() === 'production') {
    // Generate a random 6-digit code
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  } else {
    // Development environment, use a fixed code
    return '1234';
  }
};

export const generateUniqueIdFromName = (name: string): string => {
  const names = name.split(' ').filter((n) => n.length > 0); // Remove empty strings
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
  const min = 100000; 
  const max = 999999; 
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
  
  const formattedInitials = initials.length > 3 ? initials.substring(0, 3) : initials;

  return `${formattedInitials}-${randomNumber}`;
};


export const generate_transaction_reference = (): string => {
  try {
    const maxDigits = 10;
    let digits = 'Ref';
    for (let i = 0; i < maxDigits; i++) {
      digits += Math.floor(Math.random() * 10).toString();
    }
    return digits;
  } catch (error) {
    console.error('Error generating transaction reference:', error);
    return ''; 
  }
};



