from typing import List,Optional
from pydantic import  BaseModel,Field

class Education(BaseModel):
    degree:Optional[str]=Field(description="Degree obtained")
    field_of_study:Optional[str]=Field(description="Field of study")
    institute:Optional[str]=Field(description="Univeristy or Institute name")
    year:Optional[str]=Field(description="Graduation year")

class WorkExperience(BaseModel):
    company: Optional[str]
    role: Optional[str]
    start_date: Optional[str]
    end_date: Optional[str]
    description: Optional[str]
    
class Resume(BaseModel):
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    skills: List[str] = []
    total_years_experience: Optional[float]
    education: List[Education] = []
    work_experience: List[WorkExperience] = []