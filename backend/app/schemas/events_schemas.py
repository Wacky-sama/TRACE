from pydantic import BaseModel, validator, model_validator # pyright: ignore[reportMissingImports]
from uuid import UUID
from datetime import date, datetime, time
from typing import Optional

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    start_date: date
    end_date: date
    start_time_startday: Optional[time] = None
    end_time_startday: Optional[time] = None
    start_time_endday: Optional[time] = None
    end_time_endday: Optional[time] = None

    @validator('end_date')
    def end_date_must_be_after_start(cls, v, values):
        if 'start_date' in values and v < values['start_date']:
            raise ValueError('End date must be on or after start date')
        return v
    
    @model_validator(mode="after")
    def validate_times_presence_and_order(self):
        sd = self.start_date
        ed = self.end_date

        # If single-day event
        if sd and ed and sd == ed:
            s = self.start_time_startday
            e = self.end_time_startday

            if not s:
                raise ValueError('Start time for start date is required for same-day events')
            if not e:
                raise ValueError('End time for start date is required for same-day events')

            if e <= s:
                raise ValueError('End time must be after start time for the same day')

        # If multi-day event
        if sd and ed and ed > sd:
            et_start = self.end_time_startday
            st_end = self.start_time_endday

            if not et_start:
                raise ValueError('End time on the start date is required for multi-day events')
            if not st_end:
                raise ValueError('Start time on the end date is required for multi-day events')

        return self

class EventOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    location: str
    start_date: date
    end_date: date
    
    start_time_startday: Optional[time] = None
    end_time_startday: Optional[time] = None
    start_time_endday: Optional[time] = None
    end_time_endday: Optional[time] = None
    
    created_by: UUID
    created_at: datetime
    created_by_name: Optional[str] = None

    class Config:
        from_attributes = True