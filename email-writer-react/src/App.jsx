import './App.css';
import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
} from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
         `${API_URL}/api/email/generate`,
         {
          emailContent,
          tone,
        }
      );

      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (err) {
      setError('An error occurred while generating the reply. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      {/* Chrome Extension Section */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          border: '1px solid #ddd',
          borderRadius: 2,
          backgroundColor: '#fafafa',
        }}
      >
        <Typography variant="h5" gutterBottom>
          🚀 Chrome Extension Available
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Generate AI email replies directly inside Gmail using the Chrome
          Extension.
        </Typography>

        <Button
          variant="contained"
          href="/email-writer-ext-zip.zip"
          download
          sx={{ mr: 2 }}
        >
          Download Extension
        </Button>

        <Button
          variant="outlined"
          onClick={() =>
            document
              .getElementById('installation-guide')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Installation Guide
        </Button>
      </Box>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>

          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="formal">Formal</MenuItem>
            <MenuItem value="informal">Informal</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="">None</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
          sx={{ py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            border: '1px solid #ccc',
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Generated Reply
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={generatedReply}
            InputProps={{
              readOnly: true,
            }}
          />

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >
            Copy To Clipboard
          </Button>
        </Box>
      )}

      {/* Installation Guide */}
      <Box
        id="installation-guide"
        sx={{
          mt: 6,
          mb: 3,
          p: 3,
          border: '1px solid #ddd',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Installation Guide
        </Typography>

        <Typography component="div">
          <ol>
            <li>Download the extension ZIP.</li>
            <li>Extract the ZIP file.</li>
            <li>Open Chrome.</li>
            <li>Go to <b>chrome://extensions</b>.</li>
            <li>Enable <b>Developer Mode</b>.</li>
            <li>Click <b>Load unpacked</b>.</li>
            <li>Select the extracted extension folder.</li>
            <li>Open Gmail and enjoy AI-powered replies.</li>
          </ol>
        </Typography>
      </Box>
    </Container>
  );
}

export default App;