import React, { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, Clock, MapPin, Phone, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Service } from '../types';
import Footer from './Footer';

interface ServiceDetailsProps {
  service: Service;
  onBack: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Senior Students': return 'bg-blue-100 text-blue-800';
      case 'Newcomer Students': return 'bg-green-100 text-green-800';
      case 'All Students': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceSteps = (serviceId: string) => {
    const steps: Record<string, string[]> = {
      'mark-enquiries': [
        'Contact your Academic Department directly for all Marks and predicate enquiries ',
      ],
      'academic-exclusions': [
        'Refer to the ITS notification',
        'Apply for an appeal against exclusion via EC (Electronic Campus)',
        'Receive outcome via SASO electronically',
        'Sign the receipt letter online via SASO',
        'Follow conditions if block is lifted, or wait 1 year if not lifted'
      ],
      'nsfas-enquiries': [
        'Visit the Financial Aid Office for enquiries',
        'Find your propensity letter form from Financial Aid Office',
        'Take form to your Academic Department',
        'Get signatures from OneStop',
        'Visit NSFAS website for other issues'
      ],
      'change-of-course': [
        'Confirm you were registered the previous academic year',
        'Apply via EC (Electronic Campus) during October/November',
        'Wait for approval email',
        'Cancel your current course first',
        'Register for the new course',
        'Visit Academic Department for module credits'
      ],
      'Subject additions and cancellations': [
        'Obtain the form from OneStop.',
        'Obtain approval from your Academic Department.'
      ],
      'NO WALK-INS Policy': [
        'NO HUMANITIES ENQUIRIES at ICT Faculty offices',
        'Do not ask staff to screen grade 12 certificate',
        'Must apply online only',
        'Check www.tut.ac.za daily for available courses'
      ],
      'Intercampus Transfers': [
        'Must be registered Computer Science Student',
        'Apply via EC (electronic Campus)',
        'Available end of October to mid-November only',
        'One intake per year only'
      ],
      'Re-admission': [
        'Had a break in studies? Get form from OneStop',
        'Returning after exclusion? Get Form from OneStop',
        'Get approval from Academic Department',
        
      ],
      'Special & Exit Examinations': [
        'Visit Examination Administration Office for all enquiries',
      ],
      'Probation': [
        'Refer to ITS notification',
        'Sign probation form via SASO electronically',
      ],
      'Other Admission Enquiries': [
        'Application status enquiries',
        'Documentation upload assistance',
        'Campus change (Admission Transfer)',
        'Contact via email: admission@tut.ac.za',
        'Phone: 0861102421',
        'Visit OneStop or Admissions Lab in Building 10',
      ],
      'Residence Administration': [
        'Contact Solly Sekgalabje',
        'Phone: 012 382 9500 or ',
        'Email: sekgalabjesb@tut.ac.za ',
        
      ],
      'Recognition / Examption (CAT)': [
        'Obtain form from OneStop',
        'Get approvals from Academic Department',
      ],
    
      'admissions': [
        'Visit www.tut.ac.za to check application closing dates',
      ],
      'timetables': [
        'Visit Academic Department for timetables',
        'Report clashes to Academic Department urgently',
      ],
      'financial-exclusion': [
        'Refer to ITS notification',
        'Visits Mr Lebelo at Students Accounts',
      ],
    };
    return steps[serviceId] || [];
  };

  const steps = getServiceSteps(service.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16" style={{paddingTop:'0px'}}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className={`transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex items-center mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold mr-4 ${getCategoryColor(service.category)}`}>
                {service.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
            <p className="text-xl text-gray-600">{service.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-xl shadow-lg p-8 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '200ms' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Information</h2>
              
              <div className="prose max-w-none">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800">{service.details}</p>
                    </div>
                  </div>
                </div>

                {steps.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Step-by-Step Process</h3>
                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          className={`flex items-start p-4 rounded-lg border-2 transition-all duration-500 cursor-pointer ${
                            expandedSection === `step-${index}` 
                              ? 'border-blue-300 bg-blue-50' 
                              : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-25'
                          }`}
                          onClick={() => setExpandedSection(
                            expandedSection === `step-${index}` ? null : `step-${index}`
                          )}
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium">{step}</p>
                            <div className={`mt-2 overflow-hidden transition-all duration-300 ${
                              expandedSection === `step-${index}` ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                              <p className="text-sm text-gray-600">
                                Click to mark this step as completed when you've finished it.
                              </p>
                            </div>
                          </div>
                          <CheckCircle className={`w-5 h-5 transition-colors duration-300 ${
                            expandedSection === `step-${index}` ? 'text-green-500' : 'text-gray-300'
                          }`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '400ms' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {/* <button className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Get Help
                </button> */}
                
               {service.statusLink ? (
  <a
    href={service.statusLink}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full bg-yellow-400 text-blue-900 font-semibold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors duration-300 flex items-center justify-center"
  >
    <Clock className="w-5 h-5 mr-2" />
    Quick Link
  </a>
) : (
  <button
    disabled
    className="w-full bg-gray-300 text-gray-600 font-semibold py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center"
  >
    <Clock className="w-5 h-5 mr-2" />
    No Link Available
  </button>
)}

              </div>
            </div>

            <div className={`bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg p-6 mt-6 text-blue-900 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '600ms' }}>
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>012 382 9500</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>admission@tut.ac.za</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>Building 5</span>
                </div>
              </div>
            </div>

            {/* <div className={`bg-white rounded-xl shadow-lg p-6 mt-6 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '800ms' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Services</h3>
              
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Academic Support</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Financial Aid</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Student Registration</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetails;