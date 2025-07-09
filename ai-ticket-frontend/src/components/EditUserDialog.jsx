import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Chip } from '@mui/material';

const EditUserDialog = ({ open, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({ role: '', skills: [] });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ role: user.role || '', skills: user.skills || [] });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user) {
      onUpdate({
        userId: user._id,
        role: formData.role,
        skills: formData.skills
      });
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {user && (
            <Box>
              <Typography variant="h6" gutterBottom>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>{user.email}</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Moderator">Moderator</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>Skills</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Add skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <Button variant="outlined" size="small" onClick={handleAddSkill}>Add</Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      size="small"
                      color="secondary"
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditUserDialog;
