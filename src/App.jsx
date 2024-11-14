import { useState, useEffect } from 'react'
import ProgressBar from './components/ProgressBar'
import { themes } from './themes'
import useLocalStorage from './hooks/useLocalStorage'
import './App.css'
import PropTypes from 'prop-types'

const PROGRESS_TRACKS = [
  { 
    id: 1, 
    name: 'Project 1', 
    color: '#0F7B6C', 
    target: 80,
    category: 'Work',
    tags: [],
    milestones: [
      { value: 25, label: 'Planning' },
      { value: 50, label: 'Development' },
      { value: 75, label: 'Testing' },
      { value: 100, label: 'Launch' }
    ]
  },
];

const CATEGORIES = ['Work', 'Personal', 'Learning', 'Health', 'Other'];
const TAGS = ['Priority', 'In Progress', 'On Hold', 'Long Term', 'Quick Win'];

const ProjectForm = ({ newProjectData, setNewProjectData, addNewProject, setIsAddingProject, theme }) => {
  const inputStyles = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #404040',
    borderRadius: '8px',
    color: '#e0e0e0',
    fontSize: '14px',
    marginBottom: '12px'
  };

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '24px',
    backgroundColor: '#2d2d2d',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid #404040',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  };

  const tagContainerStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '16px'
  };

  const tagLabelStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: '#404040',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#e0e0e0',
    fontSize: '14px'
  };

  return (
    <div style={formStyles}>
      <input
        type="text"
        placeholder="Project name"
        value={newProjectData.name}
        onChange={(e) => setNewProjectData(prev => ({ ...prev, name: e.target.value }))}
        style={inputStyles}
      />
      
      <select
        value={newProjectData.category}
        onChange={(e) => setNewProjectData(prev => ({ ...prev, category: e.target.value }))}
        style={inputStyles}
      >
        {CATEGORIES.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <div>
        <div style={{ marginBottom: '8px', color: '#e0e0e0' }}>Tags:</div>
        <div style={tagContainerStyles}>
          {TAGS.map(tag => (
            <label key={tag} style={tagLabelStyles}>
              <input
                type="checkbox"
                checked={newProjectData.tags.includes(tag)}
                onChange={(e) => {
                  setNewProjectData(prev => ({
                    ...prev,
                    tags: e.target.checked 
                      ? [...prev.tags, tag]
                      : prev.tags.filter(t => t !== tag)
                  }));
                }}
                style={{ margin: 0 }}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={addNewProject}
          disabled={!newProjectData.name.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: theme.primary,
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: newProjectData.name.trim() ? 'pointer' : 'not-allowed',
            opacity: newProjectData.name.trim() ? 1 : 0.5,
            transition: 'all 0.2s ease',
            flex: 1
          }}
        >
          Add Project
        </button>
        <button 
          onClick={() => {
            setIsAddingProject(false);
            setNewProjectData({ name: '', category: 'Other', tags: [] });
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#404040',
            color: '#e0e0e0',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

ProjectForm.propTypes = {
  newProjectData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  setNewProjectData: PropTypes.func.isRequired,
  addNewProject: PropTypes.func.isRequired,
  setIsAddingProject: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

const ProjectDisplay = ({ track, startEditing, updateName, handleKeyPress, deleteProject, updateProgress, resetProgress, theme }) => (
  <div className="project-card">
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md 
    }}>
      <div>
        {track.isEditing ? (
          <input
            type="text"
            defaultValue={track.name}
            autoFocus
            onBlur={(e) => updateName(track.id, e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, track.id, e.target.value)}
            style={{
              fontSize: '1.2em',
              fontWeight: '500',
              width: '200px'
            }}
          />
        ) : (
          <h3 style={{ 
            margin: 0,
            fontSize: '1.2em',
            fontWeight: '500',
            color: theme.text
          }}>{track.name}</h3>
        )}
        
        <div style={{ 
          display: 'flex', 
          gap: theme.spacing.xs,
          marginTop: theme.spacing.xs
        }}>
          <span className="tag">{track.category}</span>
          {track.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: theme.spacing.sm 
      }}>
        <button
          onClick={() => startEditing(track.id)}
          style={{
            padding: theme.spacing.sm,
            backgroundColor: 'transparent'
          }}
        >
          ✏️
        </button>
        <button
          onClick={() => deleteProject(track.id)}
          style={{
            padding: theme.spacing.sm,
            backgroundColor: 'transparent',
            color: theme.danger
          }}
        >
          🗑️
        </button>
      </div>
    </div>
    
    <ProgressBar 
      progress={track.progress} 
      barColor={track.color}
      backgroundColor={theme.cardBackground}
      targetValue={track.target}
      milestones={track.milestones}
      theme={theme}
    />

    <div style={{ 
      display: 'flex', 
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md 
    }}>
      <button 
        onClick={() => updateProgress(track.id)}
        disabled={track.progress === 100}
        style={{
          backgroundColor: theme.primary,
          color: theme.buttonText
        }}
      >
        Update Progress
      </button>
      <button 
        onClick={() => resetProgress(track.id)}
        disabled={track.progress === 0}
      >
        Reset
      </button>
    </div>
  </div>
);

ProjectDisplay.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    isEditing: PropTypes.bool.isRequired,
    target: PropTypes.number.isRequired,
    milestones: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired
  }).isRequired,
  startEditing: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  updateProgress: PropTypes.func.isRequired,
  resetProgress: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

function App() {
  console.log('App is rendering');
  const theme = themes.dark;
  const [tracks, setTracks] = useLocalStorage('progressTracks', 
    PROGRESS_TRACKS.map(track => ({
      ...track,
      progress: 0,
      isEditing: false,
      category: track.category || 'Other',
      tags: track.tags || [],
    }))
  );
  const [selectedProject, setSelectedProject] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    category: 'Other',
    tags: []
  });

  // Clear notification after delay
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, color) => {
    setNotification({ message, color });
  };

  const checkMilestones = (track, newProgress) => {
    const nextMilestone = track.milestones.find(m => {
      const oldProgress = track.progress;
      return m.value > oldProgress && m.value <= newProgress;
    });

    if (nextMilestone) {
      showNotification(
        `🎉 ${track.name}: Reached ${nextMilestone.label}!`,
        track.color
      );
    }
  };

  const updateProgress = (id) => {
    setTracks(prevTracks => 
      prevTracks.map(track => {
        if (track.id === id) {
          const newProgress = Math.min(track.progress + 5, 100);
          checkMilestones(track, newProgress);
          return { ...track, progress: newProgress };
        }
        return track;
      })
    );
  };

  const startEditing = (id) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === id
          ? { ...track, isEditing: true }
          : track
      )
    );
  };

  const updateName = (id, newName) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === id
          ? { ...track, name: newName, isEditing: false }
          : track
      )
    );
  };

  const handleKeyPress = (e, id, newName) => {
    if (e.key === 'Enter') {
      updateName(id, newName);
    }
  };

  const resetProgress = (id) => {
    setTracks(prevTracks => 
      prevTracks.map(track => 
        track.id === id 
          ? { ...track, progress: 0 }
          : track
      )
    );
  };

  const addNewProject = () => {
    if (!newProjectData.name.trim()) return;

    const newProject = {
      id: Date.now(),
      name: newProjectData.name.trim(),
      color: '#0F7B6C',
      target: 100,
      progress: 0,
      isEditing: false,
      category: newProjectData.category,
      tags: newProjectData.tags,
      milestones: [
        { value: 25, label: 'Start' },
        { value: 50, label: 'Halfway' },
        { value: 75, label: 'Almost There' },
        { value: 100, label: 'Complete' }
      ]
    };

    setTracks(prevTracks => [...prevTracks, newProject]);
    setIsAddingProject(false);
    setNewProjectData({ name: '', category: 'Other', tags: [] });
  };

  const notificationStyles = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    transform: notification ? 'translateX(0)' : 'translateX(120%)',
    border: notification ? `2px solid ${notification.color}` : '2px solid transparent',
    fontWeight: '500',
    color: '#333',
    maxWidth: '300px',
    wordBreak: 'break-word'
  };

  const addProjectStyles = {
    marginBottom: '20px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  };

  const getFilteredTracks = () => {
    if (!selectedProject) return tracks;
    return tracks.filter(track => track.id === selectedProject);
  };

  const deleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setTracks(prevTracks => prevTracks.filter(track => track.id !== id));
      if (selectedProject === id) {
        setSelectedProject(null);
      }
    }
  };

  const selectStyles = {
    padding: '8px 12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    width: '200px',
    cursor: 'pointer'
  };

  return (
    <div className="App">
      {notification && (
        <div style={notificationStyles}>
          {notification.message}
        </div>
      )}
      <h1>Progress Tracker</h1>
      
      <div className="controls" style={addProjectStyles}>
        <button onClick={() => setIsAddingProject(true)}>
          + New Project
        </button>
        
        <select 
          value={selectedProject || ''} 
          onChange={(e) => setSelectedProject(e.target.value ? Number(e.target.value) : null)}
          style={selectStyles}
        >
          <option value="">All Projects</option>
          {tracks.map(track => (
            <option key={track.id} value={track.id}>{track.name}</option>
          ))}
        </select>
      </div>

      {isAddingProject && (
        <ProjectForm 
          newProjectData={newProjectData}
          setNewProjectData={setNewProjectData}
          addNewProject={addNewProject}
          setIsAddingProject={setIsAddingProject}
          theme={theme}
        />
      )}

      {getFilteredTracks().map(track => (
        <div key={track.id} className="project-card">
          <ProjectDisplay 
            track={track}
            startEditing={startEditing}
            updateName={updateName}
            handleKeyPress={handleKeyPress}
            deleteProject={deleteProject}
            updateProgress={updateProgress}
            resetProgress={resetProgress}
            theme={theme}
          />
        </div>
      ))}
    </div>
  );
}

export default App
