import React from 'react';
import { FiFileText, FiTag, FiImage } from 'react-icons/fi';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { TokenFormData } from '../../types/token';

interface TokenCreationFormProps {
  formData: TokenFormData;
  onFormChange: (data: Partial<TokenFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export function TokenCreationForm({ 
  formData, 
  onFormChange, 
  onSubmit, 
  isLoading, 
  isDisabled 
}: TokenCreationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              label="Token Name"
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              required
              icon={<FiFileText />}
              placeholder="e.g., Awesome Meme Token"
            />
          </div>
          <div className="flex-1">
            <Input
              label="Token Symbol"
              type="text"
              value={formData.symbol}
              onChange={(e) => onFormChange({ symbol: e.target.value })}
              required
              icon={<FiTag />}
              placeholder="e.g., AMT"
            />
          </div>
        </div>

        <Input
          label="Token Image URL"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => onFormChange({ imageUrl: e.target.value })}
          required
          icon={<FiImage />}
          placeholder="https://example.com/image.png"
        />

        <TextArea
          label="Description"
          value={formData.description}
          onChange={(e) => onFormChange({ description: e.target.value })}
          required
          placeholder="Describe your meme token..."
        />
      </div>

      <Button 
        type="submit" 
        gradient="primary" 
        fullWidth
        disabled={isLoading || isDisabled}
      >
        {isLoading ? 'Creating Token...' : 'Create Meme Token 🚀'}
      </Button>

      {isDisabled && (
        <p className="text-sm text-red-400 text-center mt-4">
          You need at least 1 USDE to create a token
        </p>
      )}
    </form>
  );
}