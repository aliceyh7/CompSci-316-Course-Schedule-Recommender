import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';


const courses = [
  { id: 1, name: 'Introduction to Programming', department: 'Computer Science', dependencies: [] },
  { id: 2, name: 'Data Structures', department: 'Computer Science', dependencies: [1] },
  { id: 3, name: 'Algorithms', department: 'Computer Science', dependencies: [2] },
  { id: 4, name: 'Web Development', department: 'Computer Science', dependencies: [1] },
  { id: 5, name: 'Database Systems', department: 'Computer Science', dependencies: [2] },
];

const CourseDependencyVisualization = ({ courses }) => {
    const mermaidRef = useRef(null);
  
    useEffect(() => {
      mermaid.initialize({ startOnLoad: true });
      
      const mermaidDefinition = `
        graph TD
        ${courses.map(course => `    ${course.id}[${course.name}]`).join('\n')}
        ${courses.flatMap(course => 
          course.dependencies.map(depId => 
            `    ${depId} --> ${course.id}`
          )
        ).join('\n')}
      `;
  
      mermaid.render('mermaid-diagram', mermaidDefinition).then((result) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = result.svg;
        }
      });
    }, [courses]);
  
    return <div ref={mermaidRef} />;
  };

const CourseSelectionApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('selection');

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = (course) => {
    if (!selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(course => course.id !== courseId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Course Selection</h1>
      
      <div className="mb-4">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === 'selection' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('selection')}
          >
            Course Selection
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === 'dependencies' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('dependencies')}
          >
            Course Dependencies
          </button>
        </div>
      </div>

      {activeTab === 'selection' ? (
        <div>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
              <ul className="space-y-2">
                {filteredCourses.map(course => (
                  <li key={course.id} className="flex justify-between items-center">
                    <span>{course.name} - {course.department}</span>
                    <button
                      onClick={() => handleAddCourse(course)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold mb-4">Selected Courses</h2>
              <ul className="space-y-2">
                {selectedCourses.map(course => (
                  <li key={course.id} className="flex justify-between items-center">
                    <span>{course.name}</span>
                    <button
                      onClick={() => handleRemoveCourse(course.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="px-4 py-2 bg-green-500 text-white rounded-md">
              Enroll in Selected Courses
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Course Dependencies</h2>
          <CourseDependencyVisualization courses={courses} />
        </div>
      )}

        {activeTab === 'dependencies' && (
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Course Dependencies</h2>
          <CourseDependencyVisualization courses={courses} />
        </div>
      )}
    </div>
  );
};

export default CourseSelectionApp;