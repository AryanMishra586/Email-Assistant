import './App.css'
import { useState } from 'react'
import { Container, Typography,Box, TextField, InputLabel, Menu, FormControl, Button, CircularProgress} from '@mui/material'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
function App() {

  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try{

      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    }
    catch (err) {
      setError('An error occurred while generating the reply. Please try again.');
      console.error(err);
    }
    finally {
      setLoading(false);
    }



  };



  return (
    <Container maxWidth="md"  sx={{py:4}}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box  sx={{mx:3}}>
        <TextField
        fullWidth
        multiline
        rows={6}
        variant="outlined"
        label="Original Email Content"
        value={emailContent || ''}
        onChange={(e) => setEmailContent(e.target.value)}
        sx={{mb:2}}
      />

      <FormControl  fullWidth sx={{mb:2}}>
        <InputLabel>
          Tone (Optional)
        </InputLabel>
        <Select value={tone || ''} label={"Tone (Optional)"} onChange={(e) => setTone(e.target.value)}>
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
        sx={{py:1.5}}
      >
        {loading ? <CircularProgress size={24} /> : "Generate Reply"}
      </Button>

      </Box>

      {error && (
        <Typography color="error" sx={{mb:2}}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{mt:3, p:2, border: '1px solid #ccc', borderRadius: 1}}>
          <Typography variant="h6" gutterBottom>
            Generated Reply:
          </Typography>
          <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          value={generatedReply || ''}
          inputprops={{
            readOnly: true,
          }}
          />
          <Button
          variant="outlined"
          sx={{mt:2}}
          onClick={() => {
            navigator.clipboard.writeText(generatedReply);
          }}
          > Copy To Clipboard </Button>
          </Box>
      )}
    </Container>
  )
}

export default App
